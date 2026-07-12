from app.extensions import db

class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.Date, nullable=False)

    gender = db.Column(
        db.Enum("Male", "Female", "Other"),
        nullable=False
    )

    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(15), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    role_id = db.Column(
        db.Integer,
        db.ForeignKey("roles.role_id"),
        nullable=False
    )

    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    role = db.relationship("Role", back_populates="users")