from flask import Blueprint, jsonify
from sqlalchemy import text
from app.extensions import db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        # 1. Fetch KPI Metrics (SQL remains unchanged)
        kpi_query = text("""
            SELECT 
                (SELECT COUNT(*) FROM vehicles WHERE status != 'Retired') AS active_vehicles,
                (SELECT COUNT(*) FROM vehicles WHERE status = 'Available') AS available_vehicles,
                (SELECT COUNT(*) FROM vehicles WHERE status = 'In Shop') AS maintenance_vehicles,
                (SELECT COUNT(*) FROM trips WHERE status = 'Dispatched') AS active_trips,
                (SELECT COUNT(*) FROM trips WHERE status = 'Draft') AS pending_trips,
                (SELECT COUNT(*) FROM drivers WHERE status = 'On Trip') AS drivers_on_duty,
                COALESCE(ROUND(
                    ((SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip') / 
                    NULLIF((SELECT COUNT(*) FROM vehicles WHERE status != 'Retired'), 0)) * 100
                , 0), 0) AS fleet_utilization;
        """)
        kpi_row = db.session.execute(kpi_query).mappings().fetchone()
        
        # Format for React: Array of Objects
        dashboard_kpis = [
            {
                "id": 1, "title": "Active Vehicles", "value": kpi_row['active_vehicles'],
                "icon": "Truck", "trend": "+12%", "trendType": "up", "description": "Compared to last week"
            },
            {
                "id": 2, "title": "Available Vehicles", "value": kpi_row['available_vehicles'],
                "icon": "CheckCircle2", "trend": "+5%", "trendType": "up", "description": "Ready for dispatch"
            },
            {
                "id": 3, "title": "Maintenance", "value": kpi_row['maintenance_vehicles'],
                "icon": "Wrench", "trend": "-3%", "trendType": "down", "description": "Under servicing"
            },
            {
                "id": 4, "title": "Active Trips", "value": kpi_row['active_trips'],
                "icon": "Route", "trend": "+18%", "trendType": "up", "description": "Trips currently running"
            },
            {
                "id": 5, "title": "Drivers On Duty", "value": kpi_row['drivers_on_duty'],
                "icon": "Users", "trend": "+4%", "trendType": "up", "description": "Currently available"
            },
            {
                "id": 6, "title": "Fleet Utilization", "value": f"{int(kpi_row['fleet_utilization'])}%",
                "icon": "Activity", "trend": "+6%", "trendType": "up", "description": "Operational efficiency"
            }
        ]

        # 2. Fetch Recent Trips
        trips_query = text("""
            SELECT 
                t.trip_reference AS id, 
                COALESCE(v.vehicle_name, '-') AS vehicle, 
                COALESCE(d.driver_name, '-') AS driver, 
                COALESCE(t.source, '-') AS source,
                COALESCE(t.destination, '-') AS destination,
                t.status 
            FROM trips t
            LEFT JOIN vehicles v ON t.vehicle_id = v.vehicle_id
            LEFT JOIN drivers d ON t.driver_id = d.driver_id
            ORDER BY t.created_at DESC
            LIMIT 5;
        """)
        recent_trips_raw = db.session.execute(trips_query).mappings().all()

        recent_trips_data = []
        for trip in recent_trips_raw:
            recent_trips_data.append({
                "id": trip['id'],
                "vehicle": trip['vehicle'], 
                "driver": trip['driver'],
                "source": trip['source'],
                "destination": trip['destination'],
                "status": trip['status']
            })

        # 3. Fetch Vehicle Status Breakdown
        status_query = text("""
            SELECT status, COUNT(*) as count 
            FROM vehicles 
            GROUP BY status;
        """)
        status_result = db.session.execute(status_query).mappings().all()
        
        # Format for React: Map colors based on status
        color_map = {
            "Available": "#22C55E", # Green
            "On Trip": "#F97316",   # Orange
            "In Shop": "#EF4444",   # Red
            "Retired": "#94A3B8"    # Grey
        }
        
        vehicle_status_data = []
        for row in status_result:
            vehicle_status_data.append({
                "name": row['status'],
                "value": row['count'],
                "color": color_map.get(row['status'], "#000000") # Default to black if unknown
            })

        monthly_query = text("""
            SELECT 
                DATE_FORMAT(created_at, '%b') AS month,
                COUNT(*) as trips
            FROM trips
            WHERE YEAR(created_at) = YEAR(CURDATE())
            GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
            ORDER BY MONTH(created_at);
        """)
        monthly_result = db.session.execute(monthly_query).mappings().all()
        
        # Pre-fill the array so the UI chart doesn't look empty during the hackathon
        default_months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]
        monthly_dict = {m: 0 for m in default_months}
        
        # Override the 0s with real data from the database
        for row in monthly_result:
            if row['month'] in monthly_dict:
                monthly_dict[row['month']] = row['trips']
                
        # Format for React exactly like image_688df6.png
        monthly_trips_data = [{"month": k, "trips": v} for k, v in monthly_dict.items()]

        # 5. Combine into the final JSON response
        dashboard_payload = {
            "dashboardKPIs": dashboard_kpis,
            "recentTripsData": recent_trips_data,
            "vehicleStatusData": vehicle_status_data,
            "monthlyTripsData": monthly_trips_data
        }

        return jsonify(dashboard_payload), 200

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": "Failed to fetch dashboard data"}), 500