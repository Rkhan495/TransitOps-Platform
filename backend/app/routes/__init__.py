from flask import Blueprint

from app.extensions import db

auth_bp = Blueprint("auth", __name__)

# from . import auth
# from . import health
# from . import dashboard

from .auth import auth_bp
from .health import health_bp
from .dashboard import dashboard_bp