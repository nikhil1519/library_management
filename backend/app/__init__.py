import logging
from logging.handlers import WatchedFileHandler
import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

logger = None
log_directory = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
    
if not os.path.exists(log_directory):
    os.makedirs(log_directory)

logger = logging.getLogger('lib_app')
handler = WatchedFileHandler(os.path.join(log_directory, 'lib_app.log'))
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    CORS(app, origins="*", headers=['Content-Type','Authorization'])

    db.init_app(app)
    jwt.init_app(app)

    from app.users.routes import users_bp
    from app.books.routes import books_bp
    from app.borrow_requests.routes import borrow_requests_bp

    app.register_blueprint(users_bp, url_prefix='/user')
    app.register_blueprint(books_bp, url_prefix='/book')
    app.register_blueprint(borrow_requests_bp, url_prefix='/borrow_request')


    return app
