from flask import Blueprint

from app.extensions import db

auth_bp = Blueprint("auth", __name__)

from . import auth
from . import health