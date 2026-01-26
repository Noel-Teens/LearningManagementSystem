import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            getMe();
        } else {
            setLoading(false);
        }
    }, []);

    const getMe = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            toast.success(`Welcome back, ${userData.name}!`);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Inside AuthContext.js
const logout = () => {
    // 1. Clear all data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Reset state
    setUser(null);

    // 3. Force a hard redirect to the login page
    // This prevents components from trying to render with null data
    window.location.replace('/auth/login'); 
};

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            toast.success('User created successfully');
            return { success: true, data: response.data };
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const isAdmin = () => {
        return user?.role === 'SuperAdmin' || user?.role === 'Admin';
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        isAdmin,
        getMe,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;