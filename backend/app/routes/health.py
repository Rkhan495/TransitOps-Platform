from app.extensions import db
from . import auth_bp

@auth_bp.route("/")
def home():
    return {
        "status": "success",
        "message": "TransitOps Backend Running"
    }

@auth_bp.route("/health")
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