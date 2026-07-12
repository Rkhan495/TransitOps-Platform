from flask import Blueprint, jsonify, request
from sqlalchemy import text

from app.extensions import db

vehicle_bp = Blueprint("vehicle", __name__)


def _status_class(status):
    return {
        "Available": "bg-emerald-500 text-white",
        "On Trip": "bg-blue-500 text-white",
        "In Shop": "bg-amber-500 text-white",
        "Retired": "bg-slate-500 text-white",
    }.get(status, "bg-slate-400 text-white")


@vehicle_bp.route("/vehicles", methods=["GET"])
def get_vehicles():
    try:
        stats_query = text("""
            SELECT
                SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS available_count,
                SUM(CASE WHEN status = 'On Trip' THEN 1 ELSE 0 END) AS on_trip_count,
                SUM(CASE WHEN status = 'In Shop' THEN 1 ELSE 0 END) AS in_shop_count,
                SUM(CASE WHEN status = 'Retired' THEN 1 ELSE 0 END) AS retired_count
            FROM vehicles;
        """)
        stats_row = db.session.execute(stats_query).mappings().fetchone() or {}

        rows_query = text("""
            SELECT
                vehicle_id,
                registration_number,
                vehicle_name,
                vehicle_type,
                max_load_capacity,
                odometer,
                acquisition_cost,
                status
            FROM vehicles
            ORDER BY created_at DESC, vehicle_id DESC;
        """)
        rows = db.session.execute(rows_query).mappings().all()

        vehicles = []
        for row in rows:
            vehicles.append(
                {
                    "id": row["vehicle_id"],
                    "regNo": row["registration_number"],
                    "vehicle": row["vehicle_name"],
                    "type": row["vehicle_type"],
                    "capacity": f"{float(row['max_load_capacity']):,.0f} kg",
                    "capacityValue": float(row["max_load_capacity"]),
                    "odometer": f"{float(row['odometer']):,.0f} km",
                    "odometerValue": float(row["odometer"]),
                    "acquisitionCost": f"₹{float(row['acquisition_cost']):,.0f}",
                    "acquisitionCostValue": float(row["acquisition_cost"]),
                    "status": row["status"],
                    "statusClass": _status_class(row["status"]),
                }
            )

        return jsonify(
            {
                "vehicleStats": [
                    {
                        "label": "Available",
                        "value": int(stats_row.get("available_count") or 0),
                        "className": "bg-emerald-500 text-white",
                    },
                    {
                        "label": "On Trip",
                        "value": int(stats_row.get("on_trip_count") or 0),
                        "className": "bg-blue-500 text-white",
                    },
                    {
                        "label": "In Shop",
                        "value": int(stats_row.get("in_shop_count") or 0),
                        "className": "bg-amber-500 text-white",
                    },
                    {
                        "label": "Retired",
                        "value": int(stats_row.get("retired_count") or 0),
                        "className": "bg-slate-500 text-white",
                    },
                ],
                "vehicles": vehicles,
            }
        ), 200
    except Exception as e:
        print(f"Vehicle API Error: {e}")
        return jsonify({"error": "Failed to fetch vehicle data"}), 500


@vehicle_bp.route("/vehicles", methods=["POST"])
def create_vehicle():
    try:
        data = request.get_json() or {}

        required_fields = [
            "registration_number",
            "vehicle_name",
            "vehicle_type",
            "max_load_capacity",
            "odometer",
            "acquisition_cost",
            "status",
        ]

        for field in required_fields:
            if data.get(field) in (None, ""):
                return jsonify({"error": f"{field} is required"}), 400

        existing = db.session.execute(
            text("SELECT vehicle_id FROM vehicles WHERE registration_number = :registration_number LIMIT 1"),
            {"registration_number": data["registration_number"]},
        ).mappings().fetchone()

        if existing:
            return jsonify({"error": "Vehicle registration number already exists"}), 409

        insert_query = text("""
            INSERT INTO vehicles (
                registration_number,
                vehicle_name,
                vehicle_type,
                max_load_capacity,
                odometer,
                acquisition_cost,
                status
            ) VALUES (
                :registration_number,
                :vehicle_name,
                :vehicle_type,
                :max_load_capacity,
                :odometer,
                :acquisition_cost,
                :status
            )
        """)

        db.session.execute(
            insert_query,
            {
                "registration_number": data["registration_number"],
                "vehicle_name": data["vehicle_name"],
                "vehicle_type": data["vehicle_type"],
                "max_load_capacity": float(data["max_load_capacity"]),
                "odometer": float(data["odometer"]),
                "acquisition_cost": float(data["acquisition_cost"]),
                "status": data["status"],
            },
        )
        db.session.commit()

        return jsonify({"message": "Vehicle created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Vehicle Create Error: {e}")
        return jsonify({"error": "Failed to create vehicle"}), 500