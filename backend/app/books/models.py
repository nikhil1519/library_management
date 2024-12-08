from app import db

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    publisher = db.Column(db.String(100))
    quantity = db.Column(db.Integer, nullable=False, default=1)
    is_deleted = db.Column(db.Boolean, nullable=False, default=False)

    borrow_requests = db.relationship('BorrowRequest', back_populates='book')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'publisher': self.publisher,
            'quantity': self.quantity,
            'borrow_requests': [
                {
                    'id': borrow_request.id,
                    'start_date': borrow_request.start_date,
                    'end_date': borrow_request.end_date,
                    'status': borrow_request.status,
                    'user': {
                        'id': borrow_request.user.id,
                        'email': borrow_request.user.email
                    } if borrow_request.user else None
                } for borrow_request in self.borrow_requests
            ]
        }
    def __repr__(self):
        return f"<Book {self.title}>"

