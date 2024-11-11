// src/models/RegisterModal.js
import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { UserContext } from '../Context/UserContext';

const RegisterModal = ({ onClose }) => {
    const { register, loading, error } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            await register(formData);
            onClose();
        } catch (err) {
            setSubmitError(err.message || 'فشل التسجيل.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-80 h-auto relative flex flex-col items-center">

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
                    title="Close"
                >
                    <FaTimes />
                </button>

                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">تسجيل مستخدم جديد</h2>

                <form onSubmit={handleSubmit} className="w-full space-y-3">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">اسم المستخدم</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">الاسم الأول</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">الاسم الأخير</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">رقم الهاتف</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">صورة الملف الشخصي (اختياري)</label>
                        <input
                            type="file"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                        />
                    </div>

                    {submitError && <p className="text-red-500 text-center text-sm">{submitError}</p>}
                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                    <div className="flex justify-center space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-semibold px-4 py-1 rounded-lg shadow-md"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-lg shadow-md"
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
