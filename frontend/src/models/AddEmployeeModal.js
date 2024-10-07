// src/components/AddEmployeeModal.js
import React, { useState, useContext } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext'; // استيراد EmployeeContext

const AddEmployeeModal = ({ onClose }) => {
    const { createEmployee } = useContext(EmployeeContext); // الحصول على createEmployee من EmployeeContext
    const [employeeData, setEmployeeData] = useState({
        firstName: '',
        lastName: '',
        fingerprint: '',
        contractStartDate: '',
        contractEndDate: '',
        hourlyRate: '',
        image: null,
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setEmployeeData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await createEmployee(employeeData); // استدعاء دالة createEmployee من EmployeeContext
            onClose(); // إغلاق النافذة عند النجاح
        } catch (err) {
            // في حالة حدوث خطأ، نحاول قراءة الرسالة من السيرفر
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // تعيين رسالة الخطأ من السيرفر
            } else {
                setError('حدث خطأ أثناء إضافة الموظف. حاول مرة أخرى.'); // رسالة خطأ افتراضية
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">إضافة موظف جديد</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors duration-300"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">الاسم الأول:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={employeeData.firstName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">اسم العائلة:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={employeeData.lastName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">بصمة الإصبع:</label>
                        <input
                            type="text"
                            name="fingerprint"
                            value={employeeData.fingerprint}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">تاريخ بدء العقد:</label>
                        <input
                            type="date"
                            name="contractStartDate"
                            value={employeeData.contractStartDate}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">تاريخ انتهاء العقد:</label>
                        <input
                            type="date"
                            name="contractEndDate"
                            value={employeeData.contractEndDate}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">المعدل بالساعة:</label>
                        <input
                            type="number"
                            name="hourlyRate"
                            value={employeeData.hourlyRate}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">صورة الموظف:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded"
                        >
                            إضافة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
