from flask import request, jsonify
from app.extensions import db, bcrypt
from app.models.user import User
from app.models.role import Role
from flask_jwt_extended import create_access_token
from app.models.user import User
from app.extensions import bcrypt

from . import auth_bp


@auth_bp.route("/create-user", methods=["POST"])
def create_user():

    data = request.get_json()

    required = [
        "full_name",
        "dob",
        "gender",
        "email",
        "mobile",
        "password",
        "role_id"
    ]

    for field in required:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    existing = User.query.filter_by(email=data["email"]).first()

    if existing:
        return jsonify({"error": "Email already exists"}), 409

    role = Role.query.get(data["role_id"])

    if not role:
        return jsonify({"error": "Invalid role"}), 404

    hashed = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(
        full_name=data["full_name"],
        dob=data["dob"],
        gender=data["gender"],
        email=data["email"],
        mobile=data["mobile"],
        password_hash=hashed,
        role_id=data["role_id"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully"
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and Password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid Email or Password"}), 401

    if not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid Email or Password"}), 401

    token = create_access_token(
        identity=str(user.user_id),
        additional_claims={
            "role": user.role.role_name
        }
    )

    return jsonify({
        "message": "Login Successful",
        "token": token,
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.role_name
        }
    }), 200