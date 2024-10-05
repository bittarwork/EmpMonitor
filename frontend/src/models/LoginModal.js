// src/models/LoginModal.js
import React, { useState, useContext } from 'react';
import { UserContext } from '../Context/UserContext';

const LoginModal = ({ onClose }) => {
    const { login, loading, error } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState(null); // لتعقب الأخطاء

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null); // إعادة تعيين الخطأ قبل محاولة تسجيل الدخول
        try {
            await login(email, password); // تسجيل الدخول باستخدام الـ Context
            onClose(); // إغلاق النافذة عند نجاح تسجيل الدخول
        } catch (err) {
            setSubmitError(err.message || 'فشل تسجيل الدخول.'); // عرض الخطأ في حال حدوث مشكلة
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-100 p-6 rounded-md shadow-md w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">تسجيل الدخول</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors duration-300"
                    >
                        &times; {/* رمز إغلاق النافذة */}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">البريد الإلكتروني:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800" // إضافة لون النص هنا
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">كلمة المرور:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800" // إضافة لون النص هنا
                            required
                        />
                    </div>

                    {/* عرض الخطأ إذا وُجد */}
                    {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
                    {error && <p className="text-red-500 mb-2">{error}</p>} {/* عرض أخطاء تسجيل الدخول */}

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
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 text-white rounded"
                            disabled={loading}
                        >
                            {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
