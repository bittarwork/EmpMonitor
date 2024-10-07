import React, { useState } from 'react';
import EditEmployeeModal from '../models/EditEmployeeModal';

const EmployeeCard = ({ employee, onEditEmployee, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => setIsEditing(true);
    const handleEditClose = () => setIsEditing(false);

    const handleSave = (updatedEmployeeData) => {
        onEditEmployee(employee.id, updatedEmployeeData);
        setIsEditing(false);
    };

    // حساب عدد الأيام المتبقية لانتهاء العقد
    const contractEndDate = new Date(employee.contractEndDate);
    const today = new Date();
    const timeDifference = contractEndDate - today;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // تحديد حالة العقد
    const contractStatusMessage =
        daysRemaining <= 2 ? "ينتهي العقد خلال يومين أو أقل" : "العقد ساري";

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
                <img
                    src={employee.image}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="w-20 h-20 rounded-full border-2 border-gray-200 shadow"
                />
                <div className="ml-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {employee.firstName} {employee.lastName}
                    </h2>
                    <p className="text-gray-600">Fingerprint: {employee.fingerprint}</p>
                    <p className="text-gray-600">Hourly Rate: <span className="font-bold">${employee.hourlyRate}</span></p>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-700">تاريخ بداية العقد:</h3>
                <p className="text-gray-600">{new Date(employee.contractStartDate).toLocaleDateString()}</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-700">تاريخ انتهاء العقد:</h3>
                <p className="text-gray-600">{new Date(employee.contractEndDate).toLocaleDateString()}</p>
            </div>



            <div className="mb-4">
                <h3 className="font-semibold text-gray-700">معلومات السحب:</h3>
                <p className="text-gray-600">لا توجد معلومات سحب متاحة.</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-700">راتب هذا الأسبوع:</h3>
                <p className="text-gray-600">راتب هذا الأسبوع: $0</p>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold text-gray-700">حالة العقد:</h3>
                <div className="flex items-center">
                    {daysRemaining <= 2 && (
                        <span className="text-red-600 font-semibold mr-2 animate-pulse">🚨</span>
                    )}
                    <p className={`text-gray-600 ${daysRemaining <= 2 ? 'text-red-600' : 'text-gray-600'}`}>
                        {contractStatusMessage}
                    </p>
                </div>
            </div>
            <div className="flex gap-4 mt-6">
                <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    تعديل
                </button>
                <button onClick={() => onDelete(employee.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    حذف
                </button>
            </div>

            {isEditing && (
                <EditEmployeeModal
                    employee={employee}
                    onClose={handleEditClose}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default EmployeeCard;
