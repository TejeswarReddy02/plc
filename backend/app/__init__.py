import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv

db = SQLAlchemy()
socketio = SocketIO()

def create_app():
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
    app = Flask(__name__)
    CORS(app)

    # Handle Render's "postgres://" vs SQLAlchemy's "postgresql://" requirement
    db_url = os.environ.get('DATABASE_URL')
    if db_url and db_url.startswith('"') and db_url.endswith('"'):
        db_url = db_url[1:-1]
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    # cors_allowed_origins="*" allows your React app to connect
    socketio.init_app(app, cors_allowed_origins="*")

    # Register routes here (we will create this next)
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app