import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            try {
                const response = await api.get('/me');
                setUser(response.data);
            } catch (error) {
                sessionStorage.removeItem('access_token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        // Assume Sanctum CSRF is already handled or not needed if strictly API tokens
        const response = await api.post('/login', { email, password });
        sessionStorage.setItem('access_token', response.data.access_token);
        setUser(response.data.user);
    };

    const register = async (userData) => {
        const response = await api.post('/register', userData);
        sessionStorage.setItem('access_token', response.data.access_token);
        setUser(response.data.user);
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } finally {
            sessionStorage.removeItem('access_token');
            setUser(null);
            window.location.href = '/login';
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
