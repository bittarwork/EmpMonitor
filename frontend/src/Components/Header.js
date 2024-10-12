// src/components/Header.js
import React, { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import LoginModal from '../models/LoginModal';
import RegisterModal from '../models/RegisterModal';
import LogoutModal from '../models/LogoutModal';
import ProfileModal from '../models/ProfileModal'; // استيراد مكون بروفايل المستخدم

const Header = () => {
    const { user, logout } = useContext(UserContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogin = () => {
        setShowLoginModal(true);
    };

    const handleRegister = () => {
        setShowRegisterModal(true);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleProfile = () => {
        setShowProfileModal(true);
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Company</h1>
                {user ? (
                    <div className="flex items-center">
                        <button onClick={handleProfile} className="bg-yellow-500 px-4 py-2 rounded mr-2">معلومات المستخدم</button>
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">تسجيل الخروج</button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <button onClick={handleLogin} className="bg-blue-500 px-4 py-2 rounded mr-2">تسجيل الدخول</button>
                        <button onClick={handleRegister} className="bg-green-500 px-4 py-2 rounded">تسجيل حساب جديد</button>
                    </div>
                )}
            </div>

            {/* نافذة تسجيل الدخول */}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

            {/* نافذة تسجيل جديد */}
            {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}

            {/* نافذة تأكيد تسجيل الخروج */}
            {showLogoutModal && <LogoutModal onConfirm={() => { logout(); setShowLogoutModal(false); }} onCancel={() => setShowLogoutModal(false)} />}

            {/* نافذة بروفايل المستخدم */}
            {showProfileModal && <ProfileModal user={user} onClose={closeProfileModal} />} {/* استخدام مكون بروفايل المستخدم */}
        </header>
    );
};

export default Header;
