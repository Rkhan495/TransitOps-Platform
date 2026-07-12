from flask import Flask, app
from flask_cors import CORS
from app.extensions import db, bcrypt, migrate, jwt
from config import Config
from app.extensions import db, bcrypt, migrate

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    from app import models
    
    # from app.routes import auth_bp, dashboard_bp
    # app.register_blueprint(auth_bp)
    # app.register_blueprint(dashboard_bp)
    
    from app.routes import auth_bp, health_bp, dashboard_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(health_bp, url_prefix='/api/health')
    app.register_blueprint(dashboard_bp, url_prefix='/api')

    return app