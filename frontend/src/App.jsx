import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { Toaster } from 'react-hot-toast';
    import { AuthProvider } from './context/AuthContext';
    import { SignalProvider } from './context/SignalContext';
    import ProtectedRoute from './components/auth/ProtectedRoute';
    import Home from './pages/Home';
    import LoginPage from './pages/LoginPage';
    import RegisterPage from './pages/RegisterPage';
    import DashboardPage from './pages/DashboardPage';

    function App() {
    return (
        <Router>
        <AuthProvider>
            <SignalProvider>
            <div className="min-h-screen bg-dark-bg">
                <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333'
                    }
                }}
                />
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            </SignalProvider>
        </AuthProvider>
        </Router>
    );
    }

    export default App;