import React, { useState } from 'react';
import EmployeeModal from '../models/EmployeeModal';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const getContractStatus = () => {
        const contractEndDate = new Date(employee.contractEndDate);
        const today = new Date();
        const diffTime = contractEndDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            return { status: 'فعال', color: 'bg-green-100 text-green-600', emoji: '✅' };
        } else if (diffDays === 0) {
            return { status: 'سينتهي قريبا', color: 'bg-yellow-100 text-yellow-600', emoji: '⏰' };
        } else {
            return { status: 'منتهي', color: 'bg-red-100 text-red-600', emoji: '❎' };
        }
    };

    const { status, color, emoji } = getContractStatus();

    return (
        <div>
            <div className="bg-gray-50 border shadow-sm rounded-lg p-6 transition-all transform hover:shadow-md mb-5 w-full max-w-xs mx-auto flex flex-col justify-between">
                <div className="flex items-center mb-4">
                    <img
                        src={employee.image}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-20 h-20 rounded-full border-4 border-gray-300 mr-4"
                    />
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">{`${employee.firstName} ${employee.lastName}`}</h2>
                        <div className={`flex items-center text-sm font-medium py-1 px-2 rounded-full ${color}`}>
                            <span>{emoji}</span>
                            <span className="ml-2">{status}</span>
                        </div>
                    </div>
                </div>
                <div className="mb-4 border-t border-gray-300 pt-4">
                    <p className="text-gray-700"><strong>تاريخ انتهاء العقد:</strong> {new Date(employee.contractEndDate).toLocaleDateString('ar-SY')}</p>
                    <p className="text-gray-700"><strong>البصمة:</strong> {employee.fingerprint}</p>
                    <p className="text-gray-700"><strong>الأجر بالساعة:</strong> {employee.hourlyRate} ل.س</p>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={() => onEdit(employee)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white ml-2 px-6 py-3 rounded-md transition duration-300 w-full"
                    >
                        تعديل
                    </button>
                    <button
                        onClick={() => onDelete(employee.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md transition duration-300 w-full"
                    >
                        حذف
                    </button>
                </div>
                <button
                    onClick={openModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-300 mt-6 w-full"
                >
                    عرض التفاصيل
                </button>
            </div>
            {isModalOpen && (
                <EmployeeModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    employee={employee}
                />
            )}
        </div>
    );
};

export default EmployeeCard;
