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
            setSubmitError(err); // عرض الخطأ في حال حدوث مشكلة
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* عرض الخطأ إذا وُجد */}
                    {submitError && <p className="text-red-500">{submitError}</p>}
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">Cancel</button>
                        <button type="submit" className="bg-blue-500 px-4 py-2 text-white rounded" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
