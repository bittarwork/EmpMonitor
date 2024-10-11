import React, { useContext, useState } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext';
import EmployeeModal from '../models/EmployeeModal';

const InactiveEmployeesPage = () => {
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

    const isContractExpired = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();
        return endDate < today;
    };

    // فلترة الموظفين الذين انتهت عقودهم
    const inactiveEmployees = employees.filter(employee => {
        const hasExpiredContract = isContractExpired(employee.contractEndDate);
        const isMatchingSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        return hasExpiredContract && isMatchingSearch;
    });

    return (
        <div className="flex flex-col flex-grow pb-10">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">موظفون غير نشطين</h1>

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

            {/* جدول الموظفين غير النشطين */}
            <div className="overflow-x-auto flex-grow">
                <table className="min-w-full bg-white rounded-md shadow-md">
                    <thead className="bg-red-300">
                        <tr>
                            <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-red-300 z-10">اسم الموظف</th>
                            <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-red-300 z-10">تاريخ انتهاء العقد</th>
                            <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-red-300 z-10">صورة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inactiveEmployees.map((employee) => (
                            <tr
                                key={employee.id}
                                className="hover:bg-red-100 transition duration-200 cursor-pointer"
                                onClick={() => openModal(employee)}
                            >
                                <td className="border-b px-4 py-4 text-gray-700">{`${employee.firstName} ${employee.lastName}`}</td>
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

export default InactiveEmployeesPage;
