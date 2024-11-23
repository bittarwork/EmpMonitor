import React, { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../Context/employeeContext';
import EmployeeModal from '../models/EmployeeModal';

const InactiveEmployeesPage = () => {
    const { employees, fetchEmployees, loading, error } = useContext(EmployeeContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const openModal = (employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    // تعديل منطق التحقق من حالة العقد ليعرض الموظفين الذين انتهت عقودهم فقط
    const isContractEnded = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();

        // إذا كان تاريخ انتهاء العقد أقل من تاريخ اليوم، العقد انتهى
        return endDate < today;
    };

    // تصفية الموظفين الذين انتهت عقودهم
    const inactiveEmployees = employees.filter(employee => {
        const isInactive = isContractEnded(employee.contractEndDate);
        const isMatchingSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        return isInactive && isMatchingSearch;
    });

    return (
        <div className="flex flex-col flex-grow pb-10 px-4" dir='rtl'>
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">الموظفون المتوقفون</h1>

            {/* عرض الخطأ إذا كان موجوداً */}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            {/* مربع البحث */}
            <div className="flex mb-6 justify-center">
                <input
                    type="text"
                    placeholder="بحث عن موظف"
                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* جدول الموظفين المتوقفين */}
            {loading ? (
                <div className="text-center text-gray-700 text-lg">جاري التحميل...</div>
            ) : (
                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full bg-white rounded-md shadow-md">
                        <thead className="bg-red-300">
                            <tr>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">اسم الموظف</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">حالة العامل</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">تاريخ انتهاء العقد</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">صورة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inactiveEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="hover:bg-red-100 text-right transition duration-200 cursor-pointer"
                                    onClick={() => openModal(employee)}
                                >
                                    <td className="border-b px-4 py-4 text-gray-700">{`${employee.firstName} ${employee.lastName}`}</td>
                                    <td className="border-b px-4 py-4 text-gray-700">
                                        {isContractEnded(employee.contractEndDate) ? (
                                            <span className="text-red-500">❎ العقد منتهي</span>
                                        ) : (
                                            <span className="text-green-500">✅ العقد ساري</span>
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-4 text-gray-700">{new Date(employee.contractEndDate).toLocaleDateString()}</td>
                                    <td className="border-b px-4 py-4 text-gray-700 flex">
                                        {employee.image && (
                                            <img src={employee.image} alt={`${employee.firstName} ${employee.lastName}`} className="w-16 h-16 rounded-full justify-end" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* عرض Modal عند فتحه */}
            <EmployeeModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default InactiveEmployeesPage;
