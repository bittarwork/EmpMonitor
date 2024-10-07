// src/components/EditEmployeeModal.js
import React, { useState } from 'react';

const EditEmployeeModal = ({ employee, onClose, onSave }) => {
    const [employeeData, setEmployeeData] = useState({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        fingerprint: employee.fingerprint || '',
        contractStartDate: employee.contractStartDate || '',
        contractEndDate: employee.contractEndDate || '',
        hourlyRate: employee.hourlyRate || '',
        image: employee.image || null,
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

        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            formData.append(key, employeeData[key]);
        });

        try {
            await onSave(formData); // إرسال formData إلى onSave
            onClose(); // إغلاق النافذة عند النجاح
        } catch (err) {
            setError('حدث خطأ أثناء تعديل الموظف. حاول مرة أخرى.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">تعديل بيانات الموظف</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors duration-300"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* الحقول نفس AddEmployeeModal */}
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
                            حفظ التعديلات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployeeModal;
