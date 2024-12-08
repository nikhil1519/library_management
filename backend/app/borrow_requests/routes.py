import csv
import io
from sqlalchemy.exc import SQLAlchemyError
from flask import Blueprint, Response, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.borrow_requests.models import BorrowRequest
from app.books.models import Book
from app import db, logger
from datetime import datetime

from app.users.models import User

borrow_requests_bp = Blueprint('borrow_requests', __name__)

@borrow_requests_bp.route('/request', methods=['POST'])
@jwt_required()
def request_borrow():
    try:
        data = request.get_json()

        user_id = get_jwt_identity()
        book_id = data.get('book_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if not book_id or not start_date or not end_date:
            return jsonify({"message": "Missing book ID or dates"}), 400
        
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()

        if start_date >= end_date:
            return jsonify({"message": "Start date cannot be after end date"}), 400

        existing_request = BorrowRequest.query.filter(
            BorrowRequest.book_id == book_id,
            BorrowRequest.status == 'approved',
            ((start_date >= BorrowRequest.start_date) & (start_date <= BorrowRequest.end_date)) |
            ((end_date >= BorrowRequest.start_date) & (end_date <= BorrowRequest.end_date))
        ).first()

        if existing_request:
            return jsonify({"message": "This book is already borrowed during that period"}), 400

        new_request = BorrowRequest(user_id=user_id, book_id=book_id, start_date=start_date, end_date=end_date)
        db.session.add(new_request)
        db.session.commit()

        return jsonify({"message": "Borrow request submitted successfully...!"}), 201
    except (Exception, SQLAlchemyError) as error:
        db.session.rollback()
        logger.error(f"Error while creating new borrow request: {str(error)}")
        return jsonify({"message": "Error while creating new borrow request"}), 500

@borrow_requests_bp.route('/manage/<int:request_id>', methods=['PUT'])
@jwt_required()
def manage_request(request_id):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'librarian':
            return jsonify({"message": "Only librarians can manage borrow requests"}), 403

        allowed_fields = ['status', 'start_date', 'end_date']
        updates = {key: value for key, value in data.items() if key in allowed_fields}

        if 'status' in updates and updates['status'] not in ['approved', 'denied', 'pending']:
            return jsonify({"message": "Invalid status. It must be 'approved', 'denied', or 'pending'."}), 400

        borrow_request = BorrowRequest.query.get(request_id)
        if not borrow_request:
            return jsonify({"message": "Borrow request not found"}), 404

        for key, value in updates.items():
            if key in ['start_date', 'end_date']:
                try:
                    value = datetime.strptime(value, '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({"message": f"Invalid date format for {key}. Use 'YYYY-MM-DD'."}), 400

            setattr(borrow_request, key, value)

        db.session.commit()

        return jsonify({
            "message": f"Borrow request updated successfully...",
            "updated_request": borrow_request.to_dict()
        }), 200
    except (Exception, SQLAlchemyError) as error:
        db.session.rollback()
        logger.error(f"Failed to update borrow request: {str(error)}")
        return jsonify({"message": "Failed to update borrow request"}), 500

def fetch_borrow_history(user_id, user_role):
    if user_role == 'user':
        return db.session.query(BorrowRequest, User, Book).join(User, BorrowRequest.user_id == User.id).join(Book, BorrowRequest.book_id == Book.id).filter(BorrowRequest.user_id == user_id).order_by(BorrowRequest.created_at.desc()).all()
    elif user_role == 'librarian':
        return db.session.query(BorrowRequest, User, Book).join(User, BorrowRequest.user_id == User.id).join(Book, BorrowRequest.book_id == Book.id).order_by(BorrowRequest.created_at.desc()).all()
    else:
        return None

@borrow_requests_bp.route('/history', methods=['GET'])
@jwt_required()
def borrow_history():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        user_role = user.role
        borrow_history = fetch_borrow_history(user_id, user_role)

        if borrow_history is None:
            return jsonify({"message": "Invalid role"}), 403
        if not borrow_history:
            return jsonify({"message": "No borrow history found"}), 404

        if 'csv' in request.args and request.args['csv'].lower() == 'true':
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(['Book Title', 'Borrower', 'Request Date', 'Start Date', 'End Date', 'Status'])

            for req, user, book in borrow_history:
                writer.writerow([
                    book.title,
                    user.email,
                    req.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    req.start_date.strftime("%Y-%m-%d"),
                    req.end_date.strftime("%Y-%m-%d"),
                    req.status
                ])
            
            output.seek(0)
            return Response(
                output.getvalue(),
                mimetype='text/csv',
                headers={'Content-Disposition': 'attachment; filename=borrow_history.csv'}
            ), 200
        else:
            history_data = [
                {
                    "id": req.id,
                    "title": book.title,
                    "author": book.author,
                    "user_email": user.email,
                    "publisher": book.publisher,
                    "start_date": req.start_date,
                    "end_date": req.end_date,
                    "created_at": req.created_at,
                    "status": req.status,
                }
                for req, user, book in borrow_history
            ]
            return jsonify(history_data), 200

    except (Exception, SQLAlchemyError) as error:
        logger.error(f"Error while fetching borrow history: {str(error)}")
        return jsonify({"message": "Error while fetching borrow history"}), 500