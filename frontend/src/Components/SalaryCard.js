import React from "react";

const SalaryCard = ({ salary, onAddPayment }) => {
    const getContractStatus = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) {
            return <span className="text-red-600 font-semibold">❌ عقد منتهي</span>;
        } else if (daysDiff <= 2) {
            return <span className="text-yellow-500 font-semibold">⚠️ العقد سينتهي قريبًا</span>;
        } else {
            return <span className="text-green-500 font-semibold">✅ العقد ساري</span>;
        }
    };

    const totalWithdrawals = salary.withdrawals.reduce((sum, withdrawal) => {
        if (withdrawal.material && withdrawal.material.price) {
            return sum + withdrawal.material.price * withdrawal.quantity;
        }
        return sum; // or you can return sum + 0 if no material price exists
    }, 0);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
            {/* Header Section */}
            <div className="flex items-center space-x-4 border-b pb-4">
                <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 text-xl font-bold">
                    {salary.employee.firstName[0]}
                    {salary.employee.lastName[0]}
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {salary.employee.firstName} {salary.employee.lastName}
                    </h2>
                    <div className="text-sm text-gray-500">{getContractStatus(salary.employee.contractEndDate)}</div>
                </div>
            </div>

            {/* Salary Details */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner space-y-2">
                <h3 className="text-md font-semibold text-gray-700 mb-2">تفاصيل الراتب:</h3>
                <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">إجمالي الراتب:</span>
                    <span className="font-semibold text-gray-900">{Math.floor(salary.totalSalary)} ل.س</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">إجمالي ساعات العمل:</span>
                    <span className="font-semibold text-gray-900">{salary.totalWorkedHours.toFixed(2)} ساعة</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">المتبقي:</span>
                    <span className="font-semibold text-gray-900">{Math.floor(salary.remainingAmount)} ل.س</span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="font-semibold text-gray-700">المدفوع:</span>
                    <span className="font-semibold text-gray-900">{Math.floor(salary.paidAmount)} ل.س</span>
                </div>
            </div>

            {/* Withdrawals Section */}
            {salary.withdrawals.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 shadow-inner space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">تفاصيل السحوبات:</h3>
                    <ul className="list-disc pr-5 text-sm text-gray-700 space-y-2">
                        {salary.withdrawals.map((withdrawal) => (
                            <li key={withdrawal._id}>
                                <span className="font-semibold text-gray-900">{withdrawal.material.name}</span> - الكمية:{" "}
                                <span className="font-medium text-gray-800">{withdrawal.quantity}</span> - السعر:{" "}
                                <span className="font-medium text-gray-800">{Math.floor(withdrawal.material.price)} ل.س</span> - التاريخ:{" "}
                                <span className="font-medium text-gray-800">{new Date(withdrawal.date).toLocaleDateString("ar-SY")}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between mt-4 border-t pt-2">
                        <span className="font-semibold text-gray-700">إجمالي السحوبات:</span>
                        <span className="font-semibold text-gray-900">{Math.floor(totalWithdrawals)} ل.س</span>
                    </div>
                </div>
            )}

            {/* Footer Section */}
            <div className="text-sm text-gray-500">
                <span>آخر تعديل للراتب:</span> {new Date(salary.salaryDate).toLocaleDateString("ar-SY")}
            </div>

            {/* Add Payment Button */}
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full mt-4 transition duration-200"
                onClick={() => onAddPayment(salary._id)}
            >
                إضافة دفعة
            </button>
        </div>
    );
};

export default SalaryCard;
