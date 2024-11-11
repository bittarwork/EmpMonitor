// src/models/LoginModal.js
import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { UserContext } from '../Context/UserContext';

const LoginModal = ({ onClose }) => {
    const { login, loading, error } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        try {
            await login(email, password);
            onClose();
        } catch (err) {
            setSubmitError(err.message || 'فشل تسجيل الدخول.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-80 h-auto relative flex flex-col items-center">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
                    title="Close"
                >
                    <FaTimes />
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">تسجيل الدخول</h2>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>

                    {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-md"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
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
