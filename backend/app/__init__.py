from flask import Flask
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
    
    from app.routes import auth_bp
    app.register_blueprint(auth_bp)

    return app