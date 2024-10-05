// src/models/RegisterModal.js
import React, { useState, useContext } from 'react';
import { UserContext } from '../Context/UserContext';

const RegisterModal = ({ onClose }) => {
    const { register, loading, error } = useContext(UserContext); // تأكد من وجود دالة التسجيل في UserContext
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState(null); // لتعقب الأخطاء

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null); // إعادة تعيين الخطأ قبل محاولة التسجيل
        try {
            await register(name, email, password); // تسجيل مستخدم جديد باستخدام الـ Context
            onClose(); // إغلاق النافذة عند نجاح التسجيل
        } catch (err) {
            setSubmitError(err.message || 'فشل التسجيل.'); // عرض الخطأ في حال حدوث مشكلة
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">تسجيل مستخدم جديد</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 p-2 rounded-full transition-colors duration-300"
                    >
                        &times; {/* رمز إغلاق النافذة */}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">الاسم:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">البريد الإلكتروني:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">كلمة المرور:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* عرض الخطأ إذا وُجد */}
                    {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
                    {error && <p className="text-red-500 mb-2">{error}</p>} {/* عرض أخطاء التسجيل */}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2 text-gray-800"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded"
                            disabled={loading}
                        >
                            {loading ? 'جارٍ التسجيل...' : 'تسجيل'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;
