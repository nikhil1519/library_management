from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    is_deleted = db.Column(db.Boolean, nullable=False, default=False)
    
    borrow_requests = db.relationship('BorrowRequest', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'borrow_requests': [
                {
                    'id': borrow_request.id,
                    'start_date': borrow_request.start_date,
                    'end_date': borrow_request.end_date,
                    'status': borrow_request.status,
                    'book': {
                        'id': borrow_request.book.id,
                        'title': borrow_request.book.title,
                        'author': borrow_request.book.author
                    } if borrow_request.book else None
                } for borrow_request in self.borrow_requests
            ]
        }

    def __repr__(self):
        return f"<User {self.email}>"
