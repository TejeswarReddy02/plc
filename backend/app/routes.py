from flask import Blueprint, request, jsonify
from .models import db, User, Attendance, Poll
from datetime import datetime

api_bp = Blueprint('api', __name__)

# --- AUTHENTICATION ---

@api_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    new_user = User(
        email=data['email'], 
        password=data['password'], # In production, use werkzeug.security.generate_password_hash
        role=data.get('role', 'student')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.password == data['password']:
        # For now, returning user info. Later, we'll replace this with a JWT.
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role
            }
        }), 200
    return jsonify({'error': 'Invalid credentials'}), 401

# --- ATTENDANCE ---

@api_bp.route('/attendance', methods=['POST'])
def mark_attendance():
    data = request.json
    # Check if attendance already marked for today
    today = datetime.utcnow().date()
    existing = Attendance.query.filter_by(user_id=data['user_id'], date=today).first()
    
    if existing:
        return jsonify({'message': 'Attendance already marked for today'}), 200

    new_attendance = Attendance(user_id=data['user_id'], date=today, status='present')
    db.session.add(new_attendance)
    db.session.commit()
    return jsonify({'message': 'Attendance recorded'}), 201

# --- POLLS ---

@api_bp.route('/polls', methods=['GET'])
def get_polls():
    polls = Poll.query.filter_by(is_active=True).all()
    return jsonify([{
        'id': p.id,
        'question': p.question,
        'options': p.options
    } for p in polls])

@api_bp.route('/polls', methods=['POST'])
def create_poll():
    data = request.json
    # data should look like: {"question": "Topic?", "options": ["A", "B"]}
    new_poll = Poll(
        question=data['question'],
        options=data['options']
    )
    db.session.add(new_poll)
    db.session.commit()
    return jsonify({'message': 'Poll created', 'id': new_poll.id}), 201

@api_bp.route('/debug/users', methods=['GET'])
def debug_users():
    # This fetches all users directly from Render Postgres
    users = User.query.all()
    output = []
    for user in users:
        output.append({
            "id": user.id,
            "email": user.email,
            "role": user.role
        })
    return jsonify(output)