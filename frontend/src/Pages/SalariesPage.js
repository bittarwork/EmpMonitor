import React, { useState, useEffect } from "react";

const SalariesPage = () => {
    const [salaryData, setSalaryData] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/salary/salaries`)
            .then((response) => response.json())
            .then((data) => setSalaryData(data))
            .catch((error) => console.error("خطأ في جلب بيانات الراتب:", error));
    }, []);

    const getContractStatus = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) {
            return <span className="text-red-500 font-semibold">❎ العقد منتهي</span>;
        } else if (daysDiff <= 2) {
            return <span className="text-yellow-500 font-semibold">⏰ العقد سينتهي قريباً</span>;
        } else {
            return <span className="text-green-500 font-semibold">✅ العقد ساري</span>;
        }
    };

    if (!salaryData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">جارٍ التحميل...</span>
            </div>
        );
    }

    return (
        <div className="overflow-auto" dir="rtl">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-700">معلومات الرواتب</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salaryData.map((salary) => {
                    const totalWithdrawals = salary.withdrawals.reduce(
                        (sum, withdrawal) => sum + withdrawal.material.price * withdrawal.quantity,
                        0
                    );

                    return (
                        <div key={salary._id} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                            {/* Header Section */}
                            <div className="flex items-center space-x-4">
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
                            <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                                <h3 className="text-md font-semibold text-gray-600 mb-2">تفاصيل الراتب:</h3>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-semibold">إجمالي الراتب:</span>
                                    <span>{Math.floor(salary.totalSalary)} ل.س</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-semibold">إجمالي ساعات العمل:</span>
                                    <span>{salary.totalWorkedHours.toFixed(2)} ساعة</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-semibold">المتبقي:</span>
                                    <span>{Math.floor(salary.remainingAmount)} ل.س</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="font-semibold">المدفوع:</span>
                                    <span>{Math.floor(salary.paidAmount)} ل.س</span>
                                </div>
                            </div>

                            {/* Withdrawals Section */}
                            {salary.withdrawals.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                                    <h3 className="text-md font-semibold text-gray-600 mb-2">تفاصيل السحوبات:</h3>
                                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                                        {salary.withdrawals.map((withdrawal) => (
                                            <li key={withdrawal._id}>
                                                <span className="font-semibold">{withdrawal.material.name}</span> - الكمية:{" "}
                                                {withdrawal.quantity} - السعر: {Math.floor(withdrawal.material.price)} ل.س - التاريخ:{" "}
                                                {new Date(withdrawal.date).toLocaleDateString("ar-SY")}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between mt-4 border-t pt-2">
                                        <span className="font-semibold">إجمالي السحوبات:</span>
                                        <span>{Math.floor(totalWithdrawals)} ل.س</span>
                                    </div>
                                </div>
                            )}

                            {/* Footer Section */}
                            <div className="text-sm text-gray-500">
                                <span>آخر تعديل للراتب:</span> {new Date(salary.salaryDate).toLocaleDateString("ar-SY")}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SalariesPage;
