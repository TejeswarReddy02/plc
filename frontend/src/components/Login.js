import React, { useState } from 'react';
import API from '../api';

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/login', { email, password });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setAuth(res.data.user);
            alert(`Logged in as ${res.data.user.role}`);
        } catch (err) {
            alert("Login failed! Check credentials.");
        }
    };

    return (
        <div className="login-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>PLC Learning Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
                <div>
                    <label>Email:</label><br/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>Password:</label><br/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: '20px', width: '100%' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;