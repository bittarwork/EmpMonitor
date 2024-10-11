import React, { useContext, useState } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext';
import EmployeeModal from '../models/EmployeeModal';

const ActiveEmployeesPage = () => {
    const { employees } = useContext(EmployeeContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const isContractEndingSoon = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff <= 2 && daysDiff >= 0;
    };

    // فلترة الموظفين بناءً على حالة العقد واسم الموظف
    const activeEmployees = employees.filter(employee => {
        const isActive = !isContractEndingSoon(employee.contractEndDate);
        const isMatchingSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        return isActive && isMatchingSearch;
    });

    // تحليل الموظفين
    const totalActiveEmployees = activeEmployees.length;
    const totalSalaries = activeEmployees.reduce((sum, employee) => sum + employee.hourlyRate, 0);
    const averageSalary = totalActiveEmployees > 0 ? totalSalaries / totalActiveEmployees : 0;
    const employeesWithImage = activeEmployees.filter(employee => employee.image).length;

    return (
        <div className="flex flex-col flex-grow pb-10">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">موظفون فعالون</h1>

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

            {/* تحليلات الموظفين */}
            <div className="bg-white p-6 rounded-md shadow-md mb-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">تحليلات الموظفين</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-md shadow">
                        <h3 className="text-lg font-semibold text-gray-700">إجمالي الموظفين النشطين</h3>
                        <p className="text-xl font-bold text-gray-900">{totalActiveEmployees}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow">
                        <h3 className="text-lg font-semibold text-gray-700">إجمالي الرواتب</h3>
                        <p className="text-xl font-bold text-gray-900">{totalSalaries} دولار</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow">
                        <h3 className="text-lg font-semibold text-gray-700">متوسط الرواتب</h3>
                        <p className="text-xl font-bold text-gray-900">{averageSalary.toFixed(2)} دولار</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow">
                        <h3 className="text-lg font-semibold text-gray-700">عدد الموظفين الذين لديهم صورة</h3>
                        <p className="text-xl font-bold text-gray-900">{employeesWithImage}</p>
                    </div>
                </div>
            </div>

            {/* جدول الموظفين النشطين */}
            <div className="overflow-x-auto flex-grow">
                <table className="min-w-full bg-white rounded-md shadow-md">
                    <thead className="bg-blue-300">
                        <tr>
                            <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">اسم الموظف</th>
                            <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">حالة العامل</th>
                            <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">تاريخ انتهاء العقد</th>
                            <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">صورة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeEmployees.map((employee) => (
                            <tr
                                key={employee.id}
                                className="hover:bg-blue-100 transition duration-200 cursor-pointer"
                                onClick={() => openModal(employee)}
                            >
                                <td className="border-b px-4 py-4 text-gray-700">{`${employee.firstName} ${employee.lastName}`}</td>
                                <td className="border-b px-4 py-4 text-gray-700">
                                    {isContractEndingSoon(employee.contractEndDate) ? (
                                        <span className="text-red-500 flex items-center">
                                            ⚠️ عقد ينتهي خلال يومين
                                        </span>
                                    ) : (
                                        <span className="text-green-500">✅ العقد ساري</span>
                                    )}
                                </td>
                                <td className="border-b px-4 py-4 text-gray-700">{new Date(employee.contractEndDate).toLocaleDateString()}</td>
                                <td className="border-b px-4 py-4 text-gray-700">
                                    <img src={employee.image} alt={`${employee.firstName} ${employee.lastName}`} className="w-16 h-16 rounded-full" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* عرض Modal عند فتحه */}
            <EmployeeModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default ActiveEmployeesPage;
