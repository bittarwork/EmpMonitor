// src/models/LogoutModal.js
import React, { useContext } from 'react';
import { UserContext } from '../Context/UserContext';

const LogoutModal = ({ onConfirm, onCancel }) => {
    const { loading } = useContext(UserContext);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    title="Close"
                >
                    &times; {/* رمز إغلاق */}
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">تأكيد تسجيل الخروج</h2>
                <p className="text-gray-700">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2 text-gray-800"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded"
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
