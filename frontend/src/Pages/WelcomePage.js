// src/pages/EmployeePage.js
import React, { useContext, useState } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext';

const EmployeePage = () => {
    const {
        employees,
        fetchEmployees,
        loading,
        setEmployees // تأكد من استيراد دالة setEmployees من السياق
    } = useContext(EmployeeContext);

    const [searchTerm, setSearchTerm] = useState('');

    const handleSortByName = () => {
        const sortedEmployees = [...employees].sort((a, b) => {
            const fullNameA = `${a.firstName} ${a.lastName}`;
            const fullNameB = `${b.firstName} ${b.lastName}`;
            return fullNameA.localeCompare(fullNameB);
        });
        setEmployees(sortedEmployees); // استخدم setEmployees لتحديث الحالة
    };

    const isContractEndingSoon = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // تحويل المدة إلى أيام
        return daysDiff <= 2 && daysDiff >= 0; // إذا كان العقد سينتهي خلال يومين
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    };

    const totalEmployees = employees.length;
    const expiringContracts = employees.filter(employee => isContractEndingSoon(employee.contractEndDate)).length;

    const filteredEmployees = employees.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pb-10">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">إدارة الموظفين</h1>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <span className="text-gray-600 text-lg">{formatDate(new Date())}</span>
                <div className="flex mt-4 md:mt-0 space-x-4">
                    <input
                        type="text"
                        placeholder="بحث عن الموظف"
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={fetchEmployees}
                        className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md">
                        تحديث
                    </button>
                    <button
                        onClick={handleSortByName}
                        className="bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition duration-300 shadow-md">
                        فرز حسب الاسم
                    </button>
                </div>
            </div>

            {/* قسم التحليلات */}
            <div className="bg-white p-6 rounded-md shadow-md mb-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">تحليلات الموظفين</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-md shadow">
                        <h3 className="text-lg font-semibold text-gray-700">إجمالي الموظفين</h3>
                        <p className="text-xl font-bold text-gray-900">{totalEmployees}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow">
                        <h3 className="text-lg font-semibold text-gray-700">عقود تنتهي قريباً</h3>
                        <p className="text-xl font-bold text-gray-900">{expiringContracts}</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-700 text-lg">جاري التحميل...</div>
            ) : (
                <div className="overflow-x-auto" style={{ maxHeight: '350px' }}>
                    <table className="min-w-full bg-white rounded-md shadow-md">
                        <thead className="bg-blue-300">
                            <tr>
                                <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">اسم الموظف</th>
                                <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">حالة العامل</th>
                                <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">ساعة الدخول</th>
                                <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">ساعة الخروج</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee._id} className="hover:bg-blue-100 transition duration-200">
                                    <td className="border-b px-4 py-4 text-gray-700">{`${employee.firstName} ${employee.lastName}`}</td>
                                    <td className="border-b px-4 py-4 text-gray-700 flex items-center">
                                        {isContractEndingSoon(employee.contractEndDate) ? (
                                            <span className="text-red-500 flex items-center">
                                                ⚠️ عقد ينتهي خلال يومين
                                            </span>
                                        ) : (
                                            <span className="text-green-500">✅ العقد ساري</span>
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-4 text-gray-700">
                                        {employee.mockAttendances.length > 0
                                            ? employee.mockAttendances[0].checkInTime
                                            : 'لم يتم الدخول'}
                                    </td>
                                    <td className="border-b px-4 py-4 text-gray-700">
                                        {employee.mockAttendances.length > 0
                                            ? employee.mockAttendances[0].checkOutTime
                                            : 'لم يتم الخروج'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeePage;
