import React, { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import LoginModal from '../models/LoginModal'; // مكون تسجيل الدخول
import LogoutModal from '../models/LogoutModal'; // مكون تأكيد تسجيل الخروج

const Header = () => {
    const { user, logout } = useContext(UserContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogin = () => {
        setShowLoginModal(true);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Company</h1>
                {user ? (
                    <div className="flex items-center">
                        <span className="mr-4">Welcome, {user.name}!</span>
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                    </div>
                ) : (
                    <button onClick={handleLogin} className="bg-blue-500 px-4 py-2 rounded">Login / Register</button>
                )}
            </div>

            {/* نافذة تسجيل الدخول */}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

            {/* نافذة تأكيد تسجيل الخروج */}
            {showLogoutModal && <LogoutModal onConfirm={() => { logout(); setShowLogoutModal(false); }} onCancel={() => setShowLogoutModal(false)} />}
        </header>
    );
};

export default Header;
