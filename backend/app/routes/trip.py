from flask import Blueprint, jsonify, request
from sqlalchemy import text

from app.extensions import db

trip_bp = Blueprint("trip", __name__)


def _status_class(status):
    return {
        "Draft": "bg-slate-500 text-white",
        "Dispatched": "bg-blue-500 text-white",
        "Completed": "bg-emerald-500 text-white",
        "Cancelled": "bg-red-500 text-white",
    }.get(status, "bg-slate-400 text-white")


def _next_trip_reference():
    row = db.session.execute(
        text("SELECT trip_reference FROM trips ORDER BY trip_id DESC LIMIT 1")
    ).mappings().fetchone()

    if not row or not row.get("trip_reference"):
        return "TR001"

    reference = row["trip_reference"]
    prefix = "TR"
    try:
        next_number = int(reference.replace(prefix, "")) + 1
    except ValueError:
        next_number = 1

    return f"{prefix}{next_number:03d}"


@trip_bp.route("/trips", methods=["GET"])
def get_trips():
    try:
        stats_query = text("""
            SELECT
                SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) AS draft_count,
                SUM(CASE WHEN status = 'Dispatched' THEN 1 ELSE 0 END) AS dispatched_count,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_count,
                SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_count
            FROM trips;
        """)
        stats_row = db.session.execute(stats_query).mappings().fetchone() or {}

        trips_query = text("""
            SELECT
                t.trip_reference AS tripReference,
                t.source,
                t.destination,
                COALESCE(v.registration_number, '-') AS registrationNumber,
                COALESCE(v.vehicle_name, '-') AS vehicleName,
                COALESCE(d.driver_name, '-') AS driverName,
                COALESCE(d.contact_number, '-') AS driverContact,
                t.cargo_weight AS cargoWeight,
                t.planned_distance AS plannedDistance,
                t.status,
                CASE
                    WHEN t.status = 'Dispatched' THEN 'Vehicle + Driver assigned'
                    WHEN t.status = 'Draft' THEN 'Awaiting dispatch'
                    WHEN t.status = 'Completed' THEN 'Trip finished'
                    ELSE 'Trip stopped'
                END AS note
            FROM trips t
            LEFT JOIN vehicles v ON t.vehicle_id = v.vehicle_id
            LEFT JOIN drivers d ON t.driver_id = d.driver_id
            ORDER BY t.created_at DESC, t.trip_id DESC;
        """)
        trips = db.session.execute(trips_query).mappings().all()

        trip_rows = []
        for row in trips:
            trip_rows.append(
                {
                    "tripReference": row["tripReference"],
                    "source": row["source"],
                    "destination": row["destination"],
                    "registrationNumber": row["registrationNumber"],
                    "vehicleName": row["vehicleName"],
                    "driverName": row["driverName"],
                    "driverContact": row["driverContact"],
                    "cargoWeight": float(row["cargoWeight"]),
                    "plannedDistance": float(row["plannedDistance"]),
                    "status": row["status"],
                    "statusClass": _status_class(row["status"]),
                    "note": row["note"],
                }
            )

        vehicles_query = text("""
            SELECT
                vehicle_id,
                registration_number,
                vehicle_name,
                max_load_capacity,
                status
            FROM vehicles
            WHERE status = 'Available'
            ORDER BY vehicle_name;
        """)
        vehicles = db.session.execute(vehicles_query).mappings().all()

        drivers_query = text("""
            SELECT
                driver_id,
                driver_name,
                contact_number,
                status
            FROM drivers
            WHERE status = 'Available'
            ORDER BY driver_name;
        """)
        drivers = db.session.execute(drivers_query).mappings().all()

        return jsonify(
            {
                "tripStats": [
                    {"label": "Draft", "value": int(stats_row.get("draft_count") or 0), "className": "bg-slate-500 text-white"},
                    {"label": "Dispatched", "value": int(stats_row.get("dispatched_count") or 0), "className": "bg-blue-500 text-white"},
                    {"label": "Completed", "value": int(stats_row.get("completed_count") or 0), "className": "bg-emerald-500 text-white"},
                    {"label": "Cancelled", "value": int(stats_row.get("cancelled_count") or 0), "className": "bg-red-500 text-white"},
                ],
                "tripRows": trip_rows,
                "vehicles": [
                    {
                        "vehicle_id": row["vehicle_id"],
                        "label": f"{row['registration_number']} - {row['vehicle_name']}",
                        "capacity": float(row["max_load_capacity"]),
                        "status": row["status"],
                    }
                    for row in vehicles
                ],
                "drivers": [
                    {
                        "driver_id": row["driver_id"],
                        "label": f"{row['driver_name']} ({row['contact_number']})",
                        "status": row["status"],
                    }
                    for row in drivers
                ],
            }
        ), 200
    except Exception as e:
        print(f"Trip API Error: {e}")
        return jsonify({"error": "Failed to fetch trip data"}), 500


@trip_bp.route("/trips", methods=["POST"])
def create_trip():
    try:
        data = request.get_json() or {}

        required_fields = ["source", "destination", "cargo_weight", "planned_distance", "status"]
        for field in required_fields:
            if data.get(field) in (None, ""):
                return jsonify({"error": f"{field} is required"}), 400

        status = data["status"]
        vehicle_id = data.get("vehicle_id")
        driver_id = data.get("driver_id")
        cargo_weight = float(data["cargo_weight"])

        vehicle = None
        if vehicle_id:
            vehicle = db.session.execute(
                text("SELECT vehicle_id, max_load_capacity, status FROM vehicles WHERE vehicle_id = :vehicle_id LIMIT 1"),
                {"vehicle_id": vehicle_id},
            ).mappings().fetchone()

            if not vehicle:
                return jsonify({"error": "Invalid vehicle"}), 404

            if cargo_weight > float(vehicle["max_load_capacity"]):
                return jsonify({"error": f"Cargo weight exceeds vehicle capacity of {vehicle['max_load_capacity']}"}), 400

        if status == "Dispatched":
            if not vehicle_id or not driver_id:
                return jsonify({"error": "Vehicle and driver are required for dispatched trips"}), 400

            if vehicle["status"] != "Available":
                return jsonify({"error": "Selected vehicle is not available"}), 400

            driver = db.session.execute(
                text("SELECT driver_id, status FROM drivers WHERE driver_id = :driver_id LIMIT 1"),
                {"driver_id": driver_id},
            ).mappings().fetchone()

            if not driver:
                return jsonify({"error": "Invalid driver"}), 404

            if driver["status"] != "Available":
                return jsonify({"error": "Selected driver is not available"}), 400

            if cargo_weight > float(vehicle["max_load_capacity"]):
                return jsonify({"error": f"Cargo weight exceeds vehicle capacity of {vehicle['max_load_capacity']}"}), 400

        trip_reference = _next_trip_reference()

        insert_query = text("""
            INSERT INTO trips (
                trip_reference,
                source,
                destination,
                vehicle_id,
                driver_id,
                cargo_weight,
                planned_distance,
                status
            ) VALUES (
                :trip_reference,
                :source,
                :destination,
                :vehicle_id,
                :driver_id,
                :cargo_weight,
                :planned_distance,
                :status
            )
        """)

        db.session.execute(
            insert_query,
            {
                "trip_reference": trip_reference,
                "source": data["source"],
                "destination": data["destination"],
                "vehicle_id": vehicle_id,
                "driver_id": driver_id,
                "cargo_weight": cargo_weight,
                "planned_distance": float(data["planned_distance"]),
                "status": status,
            },
        )

        if status == "Dispatched":
            db.session.execute(
                text("UPDATE vehicles SET status = 'On Trip' WHERE vehicle_id = :vehicle_id"),
                {"vehicle_id": vehicle_id},
            )
            db.session.execute(
                text("UPDATE drivers SET status = 'On Trip' WHERE driver_id = :driver_id"),
                {"driver_id": driver_id},
            )

        db.session.commit()
        return jsonify({"message": "Trip created successfully", "trip_reference": trip_reference}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Trip Create Error: {e}")
        return jsonify({"error": "Failed to create trip"}), 500