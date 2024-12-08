from app import create_app, db, logger

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    logger.info("Database Connected and Application started.....")
    app.run(host='0.0.0.0', debug=True, use_reloader=True)