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

    // تحديد الإيموجي بناءً على حالة العقد
    const contractStatusEmoji = daysRemaining <= 2
        ? <span className="text-red-600 font-semibold mr-2 animate-pulse">🚨</span>
        : <span className="text-green-600 font-semibold mr-2 animate-pulse">✅</span>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full transition-transform transform hover:scale-105">
            {/* السطر الأول: المعلومات */}
            <div className="flex flex-col md:flex-row items-center">
                {/* العمود الأول: الصورة والاسم */}
                <div className="w-full md:w-1/3 flex flex-col items-center md:items-start mb-4 md:mb-0 ml-3">
                    <img
                        src={employee.image}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-55 h-55 md:w-44 md:h-44 rounded-full border-4 border-gray-300 shadow-lg mb-2"
                    />
                    <h2 className="text-2xl  font-bold text-gray-800 mt-2 text-center md:text-left">
                        {employee.firstName} {employee.lastName}
                    </h2>
                </div>

                {/* العمود الثاني: معلومات البصمة، معدل الساعة، وتواريخ العقد */}
                <div className="w-full md:w-1/3 text-center md:text-left px-4">
                    <p className="text-lg text-gray-600 mb-2">
                        <span className="font-semibold">Fingerprint:</span> {employee.fingerprint}
                    </p>
                    <p className="text-lg text-gray-600 mb-2">
                        <span className="font-semibold">Hourly Rate:</span> ${employee.hourlyRate}
                    </p>
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-700">تاريخ بداية العقد:</h3>
                        <p className="text-lg text-gray-600">{new Date(employee.contractStartDate).toLocaleDateString()}</p>
                    </div>
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-700">تاريخ انتهاء العقد:</h3>
                        <p className="text-lg text-gray-600">{new Date(employee.contractEndDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* العمود الثالث: حالة الموظف */}
                <div className="w-full md:w-1/3 flex items-center justify-center md:justify-start">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">حالة العقد:</h3>
                        <div className="flex items-center justify-center">
                            {contractStatusEmoji}
                            <p className={`text-lg ${daysRemaining <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                                {contractStatusMessage}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* السطر الثاني: الأزرار */}
            <div className="flex justify-center gap-4 mt-4">
                <button onClick={handleEdit} className="px-6 py-2 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition">
                    تعديل
                </button>
                <button onClick={() => onDelete(employee.id)} className="px-6 py-2 bg-red-600 text-white text-lg rounded-lg hover:bg-red-700 transition">
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
