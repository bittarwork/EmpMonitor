// src/components/Header.js
import React, { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import LoginModal from '../models/LoginModal';
import RegisterModal from '../models/RegisterModal'; // استيراد مكون تسجيل الدخول
import LogoutModal from '../models/LogoutModal';

const Header = () => {
    const { user, logout } = useContext(UserContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false); // حالة لإظهار نافذة التسجيل
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false); // حالة لإظهار نافذة البروفايل

    const handleLogin = () => {
        setShowLoginModal(true);
    };

    const handleRegister = () => {
        setShowRegisterModal(true); // إظهار نافذة التسجيل
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleProfile = () => {
        setShowProfileModal(true); // إظهار نافذة البروفايل
    };

    const closeProfileModal = () => {
        setShowProfileModal(false); // إغلاق نافذة البروفايل
    };

    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Company</h1>
                {user ? (
                    <div className="flex items-center">
                        <button onClick={handleProfile} className="bg-yellow-500 px-4 py-2 rounded mr-2">Profile</button>
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <button onClick={handleLogin} className="bg-blue-500 px-4 py-2 rounded mr-2">Login</button>
                        <button onClick={handleRegister} className="bg-green-500 px-4 py-2 rounded">Register</button> {/* زر تسجيل جديد */}
                    </div>
                )}
            </div>

            {/* نافذة تسجيل الدخول */}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

            {/* نافذة تسجيل جديد */}
            {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />} {/* إضافة نافذة التسجيل */}

            {/* نافذة تأكيد تسجيل الخروج */}
            {showLogoutModal && <LogoutModal onConfirm={() => { logout(); setShowLogoutModal(false); }} onCancel={() => setShowLogoutModal(false)} />}

            {/* نافذة بروفايل المستخدم */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">ملف التعريف</h2>
                            <button
                                onClick={closeProfileModal}
                                className="bg-red-500 text-white hover:bg-red-600 p-2 rounded-full transition-colors duration-300"
                            >
                                &times; {/* رمز إغلاق النافذة */}
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-700">البريد الإلكتروني: {user.email}</p>
                            {/* يمكنك إضافة المزيد من معلومات المستخدم هنا */}
                        </div>
                        <div className="flex justify-end">
                            <button onClick={closeProfileModal} className="bg-gray-300 px-4 py-2 rounded">إغلاق</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
