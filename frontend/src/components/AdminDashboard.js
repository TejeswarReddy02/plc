import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [doubts, setDoubts] = useState([]); // State to hold incoming doubts

    useEffect(() => {
        // 1. Fetch existing users from Render
        axios.get('http://localhost:5000/api/users')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));

        // 2. Listen for real-time doubts
        socket.on('admin_notification', (data) => {
            setDoubts(prev => [data, ...prev]); // Add new doubt to the top of the list
            alert(`New Doubt from ${data.student_email}!`);
        });

        return () => socket.off('admin_notification'); // Cleanup on unmount
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Panel</h1>

            {/* Real-time Doubts Section */}
            <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>Live Doubt Feed ({doubts.length})</h3>
                {doubts.length === 0 ? <p>No active doubts.</p> : (
                    <ul>
                        {doubts.map((d, index) => (
                            <li key={index}>
                                <strong>{d.student_email}:</strong> {d.question}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* User Management Table */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;