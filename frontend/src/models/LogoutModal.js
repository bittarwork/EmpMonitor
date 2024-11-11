// src/models/LogoutModal.js
import React, { useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { UserContext } from '../Context/UserContext';

const LogoutModal = ({ onConfirm, onCancel }) => {
    const { loading } = useContext(UserContext);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-80 h-auto relative flex flex-col items-center">

                {/* زر الإغلاق المعدل */}
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
                    title="Close"
                >
                    <FaTimes />
                </button>

                {/* عنوان المودال */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">تأكيد تسجيل الخروج</h2>

                {/* الرسالة */}
                <p className="text-gray-700 text-center mb-6">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>

                {/* الأزرار */}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-md"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
                        disabled={loading}
                    >
                        {loading ? 'جارٍ تسجيل الخروج...' : 'تسجيل الخروج'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
