from flask import Blueprint

from app.extensions import db

auth_bp = Blueprint("auth", __name__)

# from . import auth
# from . import health
# from . import dashboard

from .auth import auth_bp
from .health import health_bp
from .dashboard import dashboard_bp
from .driver import driver_bp
from .maintenance import maintenance_bp
from .trip import trip_bp
from .vehicle import vehicle_bp