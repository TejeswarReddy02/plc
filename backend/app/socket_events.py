from . import socketio
from flask_socketio import emit

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('raise_doubt')
def handle_doubt(data):
    # data = {'student_name': 'John', 'question': 'How do I use hooks?'}
    # Broadcast to ALL connected clients (or specific rooms)
    emit('admin_notification', data, broadcast=True)

@socketio.on('submit_poll_vote')
def handle_vote(data):
    # Broadcast updated poll results to everyone live
    emit('update_poll_results', data, broadcast=True)