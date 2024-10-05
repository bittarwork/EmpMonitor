// src/models/ProfileModal.js
import React from 'react';

const ProfileModal = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    title="Close"
                >
                    &times; {/* رمز إغلاق النافذة */}
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">ملف التعريف</h2>
                <div className="mb-4">
                    <p className="text-gray-700">البريد الإلكتروني: {user.email}</p>
                    {/* يمكنك إضافة المزيد من معلومات المستخدم هنا */}
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-gray-800">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
