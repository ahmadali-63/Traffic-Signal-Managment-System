    import React, { createContext, useState, useContext, useEffect } from 'react';
    import api from '../services/api';
    import toast from 'react-hot-toast';

    const AuthContext = createContext();

    export const useAuth = () => useContext(AuthContext);

    export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        loadUser();
        } else {
        setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        } catch (error) {
        console.error('Error loading user:', error);
        logout();
        } finally {
        setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
        const response = await api.post('/auth/login', { email, password });
        const { token, ...userData } = response.data;
        
        setToken(token);
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        
        toast.success('Login successful!');
        return { success: true };
        } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        toast.error(message);
        return { success: false, error: message };
        }
    };

    const register = async (username, email, password, role = 'admin') => {
        try {
        const response = await api.post('/auth/register', { username, email, password, role });
        const { token, ...userData } = response.data;
        
        setToken(token);
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        
        toast.success('Registration successful!');
        return { success: true };
        } catch (error) {
        const message = error.response?.data?.message || 'Registration failed';
        toast.error(message);
        return { success: false, error: message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        loading,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };