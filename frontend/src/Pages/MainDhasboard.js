import React, { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../Context/employeeContext';

import EmployeeModal from '../models/EmployeeModal'; // استيراد مكون المودال

const EmployeePage = () => {
    const {
        employees,
        fetchEmployees,
        loading,
        error,
    } = useContext(EmployeeContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchEmployees(); // تحميل البيانات عند تحميل الصفحة
    }, [fetchEmployees]);

    const handleSortByName = () => {

    };


    const isContractEndingSoon = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff <= 2 && daysDiff >= 0;
    };

    // const totalEmployees = employees.length;
    // const expiringContracts = employees.filter(employee => isContractEndingSoon(employee.contractEndDate)).length;

    const filteredEmployees = employees.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    return (
        <div className="flex flex-col flex-grow pb-10 px-4" dir='rtl'>
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">إدارة الموظفين</h1>

            {/* عرض الخطأ إذا كان موجوداً */}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex mt-4 md:mt-0 space-x-4 w-full">
                    <input
                        type="text"
                        placeholder="بحث عن الموظف"
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-2/3 ml-2"
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

            {/* <div className="bg-white p-6 rounded-md shadow-md mb-6">
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
            </div> */}

            {loading ? (
                <div className="text-center text-gray-700 text-lg">جاري التحميل...</div>
            ) : (
                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full bg-white rounded-md shadow-md">
                        <thead className="bg-blue-300">
                            <tr>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">اسم الموظف</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">حالة العامل</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">ساعة الدخول</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">ساعة الخروج</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee._id} className="hover:bg-blue-100 transition duration-200 cursor-pointer" onClick={() => openModal(employee)}>
                                    <td className="border-b text-right px-4 py-4 text-gray-700">{`${employee.firstName} ${employee.lastName}`}</td>
                                    <td className="border-b text-right px-4 py-4 text-gray-700 flex items-center">
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

            {/* عرض المودال عند فتحه */}
            <EmployeeModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default EmployeePage;
