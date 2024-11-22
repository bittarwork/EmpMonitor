import React, { useState, useContext } from 'react';
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
            await register(formData); // إرسال formData إلى الدالة register
            onClose(); // إغلاق النافذة عند نجاح التسجيل
        } catch (err) {
            setSubmitError(err.message || 'فشل التسجيل.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-100 p-6 rounded-md shadow-md w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">تسجيل مستخدم جديد</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors duration-300"
                    >
                        &times; {/* رمز إغلاق النافذة */}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">اسم المستخدم:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">الاسم الأول:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">الاسم الأخير:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">رقم الهاتف:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">البريد الإلكتروني:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">كلمة المرور:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">صورة الملف الشخصي (اختياري):</label>
                        <input
                            type="file"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                        />
                    </div>

                    {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
                    {error && <p className="text-red-500 mb-2">{error}</p>}

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
                            {loading ? 'جارٍ التسجيل...' : 'تسجيل'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;
