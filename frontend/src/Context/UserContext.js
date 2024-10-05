import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const SESSION_DURATION_MS = 3 * 60 * 60 * 1000; // 3 ساعات

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const sessionExpiry = localStorage.getItem('expiry');

        if (storedUser && sessionExpiry) {
            const now = new Date().getTime();
            if (now < sessionExpiry) {
                setUser(JSON.parse(storedUser));
            } else {
                localStorage.clear();
            }
        }
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
            const userData = response.data.user;
            const now = new Date().getTime();
            const expiryTime = now + SESSION_DURATION_MS;

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('expiry', expiryTime);
        } catch (err) {
            setError(err.response?.data?.message || 'Error logging in');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            // لا يوجد نقطة نهاية للخروج من أجل الخادم الحالي، ولكن يمكن التعامل مع الخروج محليًا
            setUser(null);
            localStorage.clear();
        } catch (err) {
            setError(err.response?.data?.message || 'Error logging out');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};
