import { io } from 'socket.io-client';

// The URL should match your Flask backend port
const SOCKET_URL = 'http://localhost:5000';

// Initialize the socket with auto-connect enabled
// We use "transports: ['websocket']" for better performance in 2026
export const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
});

// Optional: Add global connection listeners for debugging
socket.on('connect', () => {
    console.log('🚀 Connected to Real-Time Server:', socket.id);
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from Real-Time Server');
});

export default socket;