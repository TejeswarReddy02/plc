import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

// Custom PrivateRoute component for cleaner logic
const PrivateRoute = ({ user, children, requiredRole }) => {
  if (!user) return <Navigate to="/" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Sync state with browser storage on startup
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setInitializing(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (initializing) return <div className="loading-screen">Checking session...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        {user && (
          <nav className="flex justify-between items-center bg-slate-800 text-white px-6 py-4 shadow-lg">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold tracking-tight">PLC PLATFORM</h1>
              <span className="bg-slate-700 px-3 py-1 rounded-full text-xs uppercase">
                {user.role}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-slate-300 italic">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="bg-rose-600 hover:bg-rose-700 transition-colors px-4 py-2 rounded text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </nav>
        )}

        {/* Route Definitions */}
        <main className="container mx-auto">
          <Routes>
            {/* Auth Page */}
            <Route 
              path="/" 
              element={!user ? <Login setAuth={setUser} /> : <Navigate to="/dashboard" />} 
            />

            {/* Role-Based Dashboards */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute user={user}>
                  {user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
                </PrivateRoute>
              } 
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;