from sqlalchemy.exc import SQLAlchemyError
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from app import db, logger
from app.users.models import User
from datetime import timedelta

users_bp = Blueprint('users', __name__)

@users_bp.route('/create', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        
        if not email or not password or not role:
            return jsonify({"message": "Missing email, password or role"}), 400
        
        if role not in ['librarian', 'user']:
            return jsonify({"message": "Invalid role. It must be 'librarian' or 'user'."}), 400
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "User with this email already exists"}), 400

        hashed_password = generate_password_hash(password)

        new_user = User(email=email, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": f"{role.capitalize()} account created successfully...!"}), 201
    except (Exception, SQLAlchemyError) as error:
        db.session.rollback()
        logger.error(f"Error while creating new user: {str(error)}")
        return jsonify({"message": "Error while creating new user"}), 500

@users_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Missing email or password"}), 400

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id, fresh=True, expires_delta=timedelta(hours=1))
            return jsonify(access_token=access_token, email=email, role=user.role), 200

        return jsonify({"message": "Invalid credentials"}), 401
    except (Exception, SQLAlchemyError) as error:
        db.session.rollback()
        logger.error(f"Error while logging in user: {str(error)}")
        return jsonify({"message": "Error while logging in user"}), 500

@users_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        user_identity = get_jwt_identity()

        dummy_token = create_access_token(identity=user_identity, expires_delta=timedelta(milliseconds=1))

        return jsonify({"message": "Logged out successfully...!"}), 200
    except (Exception, SQLAlchemyError) as error:
        db.session.rollback()
        logger.error(f"Error while logging out user: {str(error)}")
        return jsonify({"message": "Error while logging out user"}), 500