import React from 'react';

const EmployeeModal = ({ isOpen, onRequestClose, employee }) => {
    if (!isOpen) return null; // إذا كانت النافذة مغلقة، لا تعرض شيء

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-8 transition-transform transform hover:scale-105">
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">{`${employee.firstName} ${employee.lastName}`}</h2>
                <img src={employee.image} alt={`${employee.firstName} ${employee.lastName}`} className="w-32 h-32 rounded-full mx-auto mb-4" />
                <div className="mb-2">
                    <strong>تاريخ بدء العقد:</strong> {new Date(employee.contractStartDate).toLocaleDateString()}
                </div>
                <div className="mb-2">
                    <strong>تاريخ انتهاء العقد:</strong> {new Date(employee.contractEndDate).toLocaleDateString()}
                </div>
                <div className="mb-2">
                    <strong>المعدل الساعي:</strong> {employee.hourlyRate} دينار
                </div>
                <div className="mb-2">
                    <strong>البصمة:</strong> {employee.fingerprint}
                </div>
                <div className="mb-2">
                    <strong>عدد الحضور:</strong> {employee.mockAttendances.length}
                </div>
                <button onClick={onRequestClose} className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-4 w-full">إغلاق</button>
            </div>
        </div>
    );
};

export default EmployeeModal;
