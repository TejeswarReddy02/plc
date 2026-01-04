from app import create_app, socketio, db

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all() # Creates tables in Render Postgres automatically
    socketio.run(app, debug=True, port=5000)