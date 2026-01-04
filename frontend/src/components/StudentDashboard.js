import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { User, CheckCircle, HelpCircle } from 'lucide-react';

// Connect to the Socket.IO server on your Flask backend
const socket = io('http://localhost:5000');

const StudentDashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [doubt, setDoubt] = useState('');

    const handleAttendance = async () => {
        try {
            await axios.post('http://localhost:5000/api/attendance', {
                user_id: user.id
            });
            setAttendanceMarked(true);
            alert("Attendance marked successfully!");
        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    };

    const handleRaiseDoubt = (e) => {
        e.preventDefault();
        if (!doubt.trim()) return;

        // Emit a real-time event to the backend
        socket.emit('raise_doubt', {
            student_email: user.email,
            question: doubt
        });

        alert("Doubt sent to Admin!");
        setDoubt('');
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1>Welcome, {user.email.split('@')[0]}!</h1>
                <p style={{ color: '#666' }}>Student Portal</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Attendance Section */}
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle color={attendanceMarked ? "green" : "gray"} />
                        <h3>Daily Attendance</h3>
                    </div>
                    <p>Mark your presence for today's session.</p>
                    <button 
                        onClick={handleAttendance} 
                        disabled={attendanceMarked}
                        style={attendanceMarked ? disabledBtnStyle : activeBtnStyle}
                    >
                        {attendanceMarked ? "Already Marked" : "Mark Present"}
                    </button>
                </div>

                {/* Real-Time Doubt Section */}
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HelpCircle color="#007bff" />
                        <h3>Ask a Doubt</h3>
                    </div>
                    <form onSubmit={handleRaiseDoubt}>
                        <textarea 
                            value={doubt}
                            onChange={(e) => setDoubt(e.target.value)}
                            placeholder="Type your question here..."
                            style={textareaStyle}
                        />
                        <button type="submit" style={activeBtnStyle}>Send to Admin</button>
                    </form>
                </div>

            </div>
        </div>
    );
};

// --- Styles ---
const sectionStyle = {
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
};

const activeBtnStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px',
    fontWeight: 'bold'
};

const disabledBtnStyle = {
    ...activeBtnStyle,
    backgroundColor: '#d4edda',
    color: '#155724',
    cursor: 'not-allowed'
};

const textareaStyle = {
    width: '100%',
    height: '80px',
    marginTop: '10px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box'
};

export default StudentDashboard;