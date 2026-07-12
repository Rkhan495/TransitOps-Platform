from flask import Blueprint, jsonify, request
from sqlalchemy import text

from app.extensions import db

driver_bp = Blueprint("driver", __name__)


def _status_class(status):
    return {
        "Available": "bg-emerald-500 text-white",
        "On Trip": "bg-blue-500 text-white",
        "Off Duty": "bg-slate-600 text-white",
        "Suspended": "bg-orange-500 text-white",
    }.get(status, "bg-slate-400 text-white")


@driver_bp.route("/drivers", methods=["GET"])
def get_drivers():
    try:
        stats_query = text("""
            SELECT
                SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS available,
                SUM(CASE WHEN status = 'On Trip' THEN 1 ELSE 0 END) AS on_trip,
                SUM(CASE WHEN status = 'Off Duty' THEN 1 ELSE 0 END) AS off_duty,
                SUM(CASE WHEN status = 'Suspended' THEN 1 ELSE 0 END) AS suspended
            FROM drivers;
        """)
        stats_row = db.session.execute(stats_query).mappings().fetchone() or {}

        rows_query = text("""
            SELECT
                driver_name AS name,
                license_number AS license,
                license_category AS category,
                DATE_FORMAT(license_expiry, '%m/%d/%Y') AS expiry,
                contact_number AS contact,
                CONCAT(ROUND(trip_completion_pct, 0), '%') AS completion,
                safety_score AS safety,
                status
            FROM drivers
            ORDER BY created_at DESC, driver_id DESC;
        """)
        rows = db.session.execute(rows_query).mappings().all()

        driver_rows = []
        for row in rows:
            driver_rows.append(
                {
                    "name": row["name"],
                    "license": row["license"],
                    "category": row["category"],
                    "expiry": row["expiry"],
                    "contact": row["contact"],
                    "completion": row["completion"],
                    "safety": row["safety"],
                    "status": row["status"],
                    "statusClass": _status_class(row["status"]),
                }
            )

        driver_stats = [
            {
                "label": "Available",
                "value": int(stats_row.get("available") or 0),
                "className": "bg-emerald-500 text-white",
            },
            {
                "label": "On Trip",
                "value": int(stats_row.get("on_trip") or 0),
                "className": "bg-blue-500 text-white",
            },
            {
                "label": "Off Duty",
                "value": int(stats_row.get("off_duty") or 0),
                "className": "bg-slate-600 text-white",
            },
            {
                "label": "Suspended",
                "value": int(stats_row.get("suspended") or 0),
                "className": "bg-orange-500 text-white",
            },
        ]

        return jsonify({"driverStats": driver_stats, "driverRows": driver_rows}), 200
    except Exception as e:
        print(f"Driver API Error: {e}")
        return jsonify({"error": "Failed to fetch driver data"}), 500


@driver_bp.route("/drivers", methods=["POST"])
def create_driver():
    try:
        data = request.get_json() or {}

        required_fields = [
            "driver_name",
            "license_number",
            "license_category",
            "license_expiry",
            "contact_number",
            "trip_completion_pct",
            "safety_score",
            "status",
        ]

        for field in required_fields:
            if data.get(field) in (None, ""):
                return jsonify({"error": f"{field} is required"}), 400

        existing = db.session.execute(
            text("SELECT driver_id FROM drivers WHERE license_number = :license_number LIMIT 1"),
            {"license_number": data["license_number"]},
        ).mappings().fetchone()

        if existing:
            return jsonify({"error": "Driver license number already exists"}), 409

        insert_query = text("""
            INSERT INTO drivers (
                driver_name,
                license_number,
                license_category,
                license_expiry,
                contact_number,
                trip_completion_pct,
                safety_score,
                status
            ) VALUES (
                :driver_name,
                :license_number,
                :license_category,
                :license_expiry,
                :contact_number,
                :trip_completion_pct,
                :safety_score,
                :status
            )
        """)

        db.session.execute(
            insert_query,
            {
                "driver_name": data["driver_name"],
                "license_number": data["license_number"],
                "license_category": data["license_category"],
                "license_expiry": data["license_expiry"],
                "contact_number": data["contact_number"],
                "trip_completion_pct": data["trip_completion_pct"],
                "safety_score": data["safety_score"],
                "status": data["status"],
            },
        )
        db.session.commit()

        return jsonify({"message": "Driver created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Driver Create Error: {e}")
        return jsonify({"error": "Failed to create driver"}), 500