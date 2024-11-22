// src/models/ProfileModal.js
import React from 'react';

const ProfileModal = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" dir='rtl'>
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    title="Close"
                >
                    &times; {/* رمز إغلاق النافذة */}
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">ملف التعريف</h2>

                <div className="flex justify-center mb-4">
                    {(
                        <img
                            src={`http://localhost:5000/${user.profileImage}`} // تأكد من استخدام المسار الصحيح للصورة
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md"
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-gray-700"><strong>اسم المستخدم:</strong> {user.username}</p>
                    <p className="text-gray-700"><strong>الاسم الأول:</strong> {user.firstName}</p>
                    <p className="text-gray-700"><strong>الاسم الأخير:</strong> {user.lastName}</p>
                    <p className="text-gray-700"><strong>رقم الهاتف:</strong> {user.phone}</p>
                    <p className="text-gray-700"><strong>البريد الإلكتروني:</strong> {user.email}</p>
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
