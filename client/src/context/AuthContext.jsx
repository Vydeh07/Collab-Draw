import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error("Invalid token, logging out.");
                    setToken(null);
                    setUser(null);
                }
            } else {
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
            }
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/signin', { email, password });
            setToken(res.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login Failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const signup = async (name, email, password) => {
        try {
            await api.post('/auth/signup', { name, email, password });
            navigate('/login');
        } catch (error) {
            console.error('Signup failed', error);
            alert('Signup Failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const value = { token, user, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
