import React, { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import LoginModal from '../models/LoginModal';
import RegisterModal from '../models/RegisterModal';
import LogoutModal from '../models/LogoutModal';
import ProfileModal from '../models/ProfileModal';
import DateTimeDisplay from '../Components/DateTimeDisplay';
import FileUploadModal from '../models/FileUploadModal';

const Header = () => {
    const { user, logout } = useContext(UserContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleLogin = () => setShowLoginModal(true);
    const handleRegister = () => setShowRegisterModal(true);
    const handleLogout = () => setShowLogoutModal(true);
    const handleProfile = () => setShowProfileModal(true);
    const handleUpload = () => setShowUploadModal(true);

    const closeProfileModal = () => setShowProfileModal(false);
    const closeUploadModal = () => setShowUploadModal(false);

    return (
        <header className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo section (left side) */}
                <div className="flex-1 items-center space-x-4">
                    <h1 className="text-2xl font-semibold">My Company</h1>
                </div>

                {/* DateTime Display (center) */}
                <div className="flex-1 text-center space-x-10">
                    <DateTimeDisplay />
                </div>

                {/* Action buttons (right side) */}
                <div className="flex">
                    {/* User-related buttons */}
                    {user ? (
                        <div className="flex space-x-4">
                            <button onClick={handleProfile} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white transition duration-300">
                                معلومات المستخدم
                            </button>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white transition duration-300">
                                تسجيل الخروج
                            </button>
                            <button onClick={handleUpload} className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded text-white transition duration-300">
                                رفع ملف الحضور
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white transition duration-300">
                                تسجيل الدخول
                            </button>
                            <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white transition duration-300">
                                تسجيل حساب جديد
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Render modals */}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
            {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
            {showLogoutModal && <LogoutModal onConfirm={() => { logout(); setShowLogoutModal(false); }} onCancel={() => setShowLogoutModal(false)} />}
            {showProfileModal && <ProfileModal user={user} onClose={closeProfileModal} />}
            {showUploadModal && <FileUploadModal onClose={closeUploadModal} />}
        </header>
    );
};

export default Header;
