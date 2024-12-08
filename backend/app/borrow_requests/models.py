from app import db
from datetime import datetime

class BorrowRequest(db.Model):
    __tablename__ = 'borrow_requests'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='borrow_requests')
    book = db.relationship('Book', back_populates='borrow_requests')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'user': {
                'id': self.user.id,
                'email': self.user.email  # Include just essential user information
            } if self.user else None,
            'book': {
                'id': self.book.id,
                'title': self.book.title,
                'author': self.book.author  # Include just essential book information
            } if self.book else None
        }

    def __repr__(self):
        return f"<BorrowRequest {self.id} - {self.status}>"