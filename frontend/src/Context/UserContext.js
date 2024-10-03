import React, { createContext, useState, useEffect } from 'react';
import { mockLogin, mockLogout } from '../backend/mockBackend';

export const UserContext = createContext();

const SESSION_DURATION_MS = 3 * 60 * 60 * 1000; // 3 ساعات

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // التحقق من وجود الجلسة عند تحميل التطبيق
        const storedUser = localStorage.getItem('user');
        const sessionExpiry = localStorage.getItem('expiry');

        if (storedUser && sessionExpiry) {
            const now = new Date().getTime();
            // التحقق مما إذا كانت الجلسة لا تزال صالحة
            if (now < sessionExpiry) {
                setUser(JSON.parse(storedUser));
            } else {
                localStorage.clear(); // مسح الجلسة إذا انتهت
            }
        }
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await mockLogin(email, password);
            const now = new Date().getTime();
            const expiryTime = now + SESSION_DURATION_MS;

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('expiry', expiryTime);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await mockLogout();
            setUser(null);
            localStorage.clear();
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
