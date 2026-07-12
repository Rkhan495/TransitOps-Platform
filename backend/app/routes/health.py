from flask import Blueprint
from app.extensions import db

# 1. Create the dedicated health blueprint
health_bp = Blueprint('health', __name__)

# 2. Attach the routes to health_bp instead of auth_bp
@health_bp.route("/")
def home():
    return {
        "status": "success",
        "message": "TransitOps Backend Running"
    }

@health_bp.route("/health")
def health():
    try:
        db.session.execute(db.text("SELECT 1"))
        return {
            "status": "success",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "failed",
            "error": str(e)
        }, 500