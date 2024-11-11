// src/models/ProfileModal.js
import React from 'react';
import { FaTimes, FaPhone, FaEnvelope } from 'react-icons/fa';

const ProfileModal = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" dir='rtl'>
            <div className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center">

                {/* زر إغلاق معدّل */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                    title="Close"
                >
                    <FaTimes />
                </button>

                {/* عنوان ملف التعريف */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">ملف التعريف</h2>

                {/* صورة المستخدم */}
                <div className="flex justify-center mb-4">
                    <img
                        src={`${user.image}`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg"
                    />
                </div>

                {/* معلومات المستخدم بطريقة جذابة */}
                <div className="space-y-3">
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <p className="text-gray-800 font-semibold">اسم المستخدم: </p>
                        <p className="text-gray-600">{user.username}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <p className="text-gray-800 font-semibold">الاسم الأول:</p>
                        <p className="text-gray-600">{user.firstName}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <p className="text-gray-800 font-semibold">الاسم الأخير:</p>
                        <p className="text-gray-600">{user.lastName}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm flex items-center space-x-2">
                        <FaPhone className="text-blue-500 ml-4" />
                        <p className="text-gray-800 font-semibold">رقم الهاتف:</p>
                        <p className="text-gray-600">{user.phone}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm flex items-center space-x-2">
                        <FaEnvelope className="text-blue-500 ml-4" />
                        <p className="text-gray-800 font-semibold">البريد الإلكتروني:</p>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                {/* زر إغلاق كبير وأنيق */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
