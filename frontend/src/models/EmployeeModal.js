import React, { useEffect, useState } from 'react';

const EmployeeModal = ({ isOpen, onRequestClose, employee }) => {
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            if (!employee || !employee.id) return;

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/withdrawals/employee/${employee.id}`);
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                setWithdrawals(data);
            } catch (error) {
                console.error("Error fetching withdrawals:", error);
            }
        };

        if (isOpen) {
            fetchWithdrawals();
        }
    }, [isOpen, employee]);

    if (!isOpen) return null;

    const totalWithdrawals = withdrawals.reduce((total, withdrawal) => total + withdrawal.quantity, 0);
    const contractEndDate = new Date(employee.contractEndDate);
    const today = new Date();
    const daysRemaining = Math.ceil((contractEndDate - today) / (1000 * 60 * 60 * 24));

    const contractStatusMessage = daysRemaining < 0 ? "انتهت صلاحية العقد" : `${daysRemaining} يوم متبقي في العقد`;
    const attendanceStatusMessage = employee.mockAttendances.length === 0
        ? "لم يتم تسجيل أي حضور لهذا الموظف."
        : `${employee.mockAttendances.length} حضور مسجل`;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center" dir="rtl">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-5 max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onRequestClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    aria-label="إغلاق"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-5xl font-bold mb-3 text-center text-blue-600">{`${employee.firstName} ${employee.lastName}`}</h2>

                <div className="flex justify-center mb-5">
                    <img
                        src={employee.image}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-32 h-32 rounded-full border-4 border-blue-300"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <strong>تاريخ بدء العقد:</strong> {new Date(employee.contractStartDate).toLocaleDateString('ar-SY')}
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <strong>تاريخ انتهاء العقد:</strong> {contractEndDate.toLocaleDateString('ar-SY')}
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <strong>المعدل الساعي:</strong> {employee.hourlyRate} ل.س
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <strong>عدد الحضور:</strong> {attendanceStatusMessage}
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                        <strong>الأيام المتبقية في العقد:</strong>
                        <span className={daysRemaining < 0 ? "text-red-600" : "text-green-600"}>
                            {contractStatusMessage}
                        </span>
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">المسحوبات:</h3>
                <div className="bg-gray-100 p-4 rounded-md mb-4 shadow-sm">
                    <div className="mb-2">
                        <strong>إجمالي المسحوبات:</strong> {totalWithdrawals} وحدة
                    </div>
                    <ul className="list-disc pl-6">
                        {withdrawals.length > 0 ? (
                            withdrawals.map((withdrawal) => (
                                <li key={withdrawal._id} className="mb-2">
                                    <div>
                                        <strong>المادة:</strong> {withdrawal.material.name}
                                    </div>
                                    <div>
                                        <strong>الكمية:</strong> {withdrawal.quantity} وحدة
                                    </div>
                                    <div>
                                        <strong>التاريخ:</strong> {new Date(withdrawal.date).toLocaleDateString('ar-SY')}
                                    </div>
                                    <div>
                                        <strong>ملاحظات:</strong> {withdrawal.note || "لا توجد ملاحظات"}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li>لا توجد مسحوبات لهذا الموظف.</li>
                        )}
                    </ul>
                </div>

                <button
                    onClick={onRequestClose}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 w-full"
                >
                    إغلاق
                </button>
            </div>
        </div>
    );
};

export default EmployeeModal;
