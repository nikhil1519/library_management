from sqlalchemy.exc import SQLAlchemyError
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.books.models import Book
from app import db, logger

books_bp = Blueprint('books', __name__)

@books_bp.route('/list', methods=['GET'])
@jwt_required()
def get_books():
    try:
        books = Book.query.filter_by(is_deleted=False).all()
        results = [Book.to_dict(book) for book in books]
        return jsonify(results), 200
    except (Exception, SQLAlchemyError) as error:
        logger.error(f"Error while fetching books list: {str(error)}")
        return jsonify({"message": "Error while fetching books list"}), 500

@books_bp.route('/add', methods=['POST'])
@jwt_required()
def add_book():
    try:
        data = request.get_json()
        
        title = data.get('title')
        author = data.get('author')
        publisher = data.get('publisher')
        quantity = data.get('quantity', 1)

        if not title or not author:
            return jsonify({"message": "Missing book details"}), 400
        
        new_book = Book(title=title, author=author, publisher=publisher, quantity=quantity)
        db.session.add(new_book)
        db.session.commit()

        return jsonify({"message": "Book added successfully...!"}), 201
    except (Exception, SQLAlchemyError) as error:
        db.session.rollback()
        logger.error(f"Error while adding new book data: {str(error)}")
        return jsonify({"message": "Error while adding new book data"}), 500

@books_bp.route('/<int:book_id>', methods=['GET'])
@jwt_required()
def get_book_details(book_id):
    try:
        book = Book.query.get(book_id)
        if not book:
            return jsonify({"message": "Book not found"}), 404
        book_details = book.to_dict()
        return jsonify(book_details), 200
    except (Exception, SQLAlchemyError) as error:
        logger.error(f"Error while fetching book details: {str(error)}")
        return jsonify({"message": "Error while fetching book details"}), 500

@books_bp.route('/update/<int:book_id>', methods=['PUT'])
@jwt_required()
def update_book(book_id):
    try:
        data = request.get_json()

        book = Book.query.get(book_id)
        if not book:
            return jsonify({"message": "Book not found"}), 404

        title = data.get('title')
        author = data.get('author')
        publisher = data.get('publisher')
        quantity = data.get('quantity')

        if title:
            book.title = title
        if author:
            book.author = author
        if publisher:
            book.publisher = publisher
        if quantity is not None:
            book.quantity = quantity

        db.session.commit()

        return jsonify({"message": "Book updated successfully...!"}), 200
    except (Exception, SQLAlchemyError) as error:
        db.session.rollback()
        logger.error(f"Error while updating book data: {str(error)}")
        return jsonify({"message": "Error while updating book data"}), 500
