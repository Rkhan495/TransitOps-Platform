from functools import wraps

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required
from sqlalchemy import text

from app.extensions import db

maintenance_bp = Blueprint("maintenance", __name__)

AUTHORIZED_ROLES = {
    "fleetmanager",
    "safetyofficer",
    "dispatcher",
    "despatcher",
    "financeanalyst",
}


def _normalize_role(role_name):
    return (role_name or "").strip().lower().replace(" ", "")


def _maintenance_role_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        role_name = _normalize_role(claims.get("role"))

        if role_name not in AUTHORIZED_ROLES:
            return jsonify({"error": "You are not authorized to access maintenance"}), 403

        return fn(*args, **kwargs)

    return wrapper


def _status_class(status):
    return {
        "Active": "bg-orange-500 text-white",
        "Completed": "bg-emerald-500 text-white",
    }.get(status, "bg-slate-500 text-white")


@maintenance_bp.route("/maintenance", methods=["GET"])
@_maintenance_role_required
def get_maintenance_logs():
    try:
        stats_query = text("""
            SELECT
                SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS active_count,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_count,
                COALESCE(ROUND(SUM(cost), 0), 0) AS total_cost
            FROM maintenance_logs;
        """)
        stats_row = db.session.execute(stats_query).mappings().fetchone() or {}

        logs_query = text("""
            SELECT
                ml.log_id,
                ml.vehicle_id,
                v.registration_number,
                v.vehicle_name,
                ml.service_type,
                ml.cost,
                DATE_FORMAT(ml.service_date, '%Y-%m-%d') AS service_date,
                ml.status
            FROM maintenance_logs ml
            LEFT JOIN vehicles v ON ml.vehicle_id = v.vehicle_id
            ORDER BY ml.created_at DESC, ml.log_id DESC;
        """)
        logs = db.session.execute(logs_query).mappings().all()

        rows = []
        for row in logs:
            rows.append(
                {
                    "id": row["log_id"],
                    "vehicle_id": row["vehicle_id"],
                    "vehicle": f"{row['registration_number']} - {row['vehicle_name']}",
                    "serviceType": row["service_type"],
                    "cost": f"₹{float(row['cost']):,.0f}",
                    "costValue": float(row["cost"]),
                    "serviceDate": row["service_date"],
                    "status": row["status"],
                    "statusClass": _status_class(row["status"]),
                }
            )

        vehicles_query = text("""
            SELECT
                vehicle_id,
                registration_number,
                vehicle_name,
                status
            FROM vehicles
            ORDER BY vehicle_name;
        """)
        vehicles = db.session.execute(vehicles_query).mappings().all()

        return jsonify(
            {
                "maintenanceStats": [
                    {
                        "label": "Active Logs",
                        "value": int(stats_row.get("active_count") or 0),
                        "className": "bg-orange-500 text-white",
                    },
                    {
                        "label": "Completed Logs",
                        "value": int(stats_row.get("completed_count") or 0),
                        "className": "bg-emerald-500 text-white",
                    },
                    {
                        "label": "Total Cost",
                        "value": f"₹{int(stats_row.get('total_cost') or 0):,}",
                        "className": "bg-slate-700 text-white",
                    },
                ],
                "maintenanceRows": rows,
                "vehicles": [
                    {
                        "vehicle_id": row["vehicle_id"],
                        "label": f"{row['registration_number']} - {row['vehicle_name']}",
                        "status": row["status"],
                    }
                    for row in vehicles
                ],
            }
        ), 200
    except Exception as e:
        print(f"Maintenance API Error: {e}")
        return jsonify({"error": "Failed to fetch maintenance data"}), 500


@maintenance_bp.route("/maintenance", methods=["POST"])
@_maintenance_role_required
def create_maintenance_log():
    try:
        data = request.get_json() or {}

        required_fields = ["vehicle_id", "service_type", "cost", "service_date", "status"]
        for field in required_fields:
            if data.get(field) in (None, ""):
                return jsonify({"error": f"{field} is required"}), 400

        vehicle = db.session.execute(
            text("SELECT vehicle_id, status FROM vehicles WHERE vehicle_id = :vehicle_id LIMIT 1"),
            {"vehicle_id": data["vehicle_id"]},
        ).mappings().fetchone()

        if not vehicle:
            return jsonify({"error": "Invalid vehicle"}), 404

        insert_query = text("""
            INSERT INTO maintenance_logs (
                vehicle_id,
                service_type,
                cost,
                service_date,
                status
            ) VALUES (
                :vehicle_id,
                :service_type,
                :cost,
                :service_date,
                :status
            )
        """)

        db.session.execute(
            insert_query,
            {
                "vehicle_id": int(data["vehicle_id"]),
                "service_type": data["service_type"],
                "cost": float(data["cost"]),
                "service_date": data["service_date"],
                "status": data["status"],
            },
        )

        if data["status"] == "Active":
            db.session.execute(
                text("UPDATE vehicles SET status = 'In Shop' WHERE vehicle_id = :vehicle_id"),
                {"vehicle_id": int(data["vehicle_id"])},
            )
        elif data["status"] == "Completed":
            db.session.execute(
                text("UPDATE vehicles SET status = 'Available' WHERE vehicle_id = :vehicle_id"),
                {"vehicle_id": int(data["vehicle_id"])},
            )

        db.session.commit()
        return jsonify({"message": "Maintenance log created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Maintenance Create Error: {e}")
        return jsonify({"error": "Failed to create maintenance log"}), 500