// src/pages/EmployeeCardsPage.js
import React, { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext';
import EmployeeCard from '../Components/EmployeeCard';
import AddEmployeeModal from '../models/AddEmployeeModal';
import EditEmployeeModal from '../models/EditEmployeeModal';

const EmployeeCardsPage = () => {
    const { employees: contextEmployees, createEmployee, updateEmployee, deleteEmployee } = useContext(EmployeeContext);
    const [employees, setEmployees] = useState(contextEmployees); // استخدام حالة محلية
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    useEffect(() => {
        setEmployees(contextEmployees); // تحديث الحالة المحلية عند تغيير الموظفين في الكونتيكست
    }, [contextEmployees]);

    const handleAddEmployee = async (employeeData) => {
        const newEmployee = await createEmployee(employeeData);
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]); // إضافة الموظف الجديد إلى الحالة
        setIsModalOpen(false); // إغلاق نافذة الإضافة بعد النجاح
    };

    const handleEditEmployee = async (employeeData) => {
        if (currentEmployee) {
            await updateEmployee(currentEmployee.id, employeeData);
            setIsEditModalOpen(false); // إغلاق نافذة التعديل بعد النجاح
            setCurrentEmployee(null); // إعادة تعيين الموظف الحالي
            // تحديث حالة الموظفين بعد التعديل
            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.id === currentEmployee.id ? { ...employee, ...employeeData } : employee
                )
            );
        }
    };

    const handleDeleteEmployee = async (id) => {
        await deleteEmployee(id);
        // تحديث الحالة المحلية لإزالة الموظف المحذوف
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
    };

    const openEditModal = (employee) => {
        setCurrentEmployee(employee); // تعيين الموظف الحالي للتعديل
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">إدارة الموظفين</h1>
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                >
                    إضافة موظف جديد
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-h-[80vh] overflow-y-auto p-4 rounded-lg shadow-lg bg-white">
                {employees.map((employee) => (
                    <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onEdit={() => openEditModal(employee)}
                        onDelete={() => handleDeleteEmployee(employee.id)}
                    />
                ))}
            </div>
            {isModalOpen && (
                <AddEmployeeModal
                    onClose={() => setIsModalOpen(false)}
                    onAddEmployee={handleAddEmployee}
                />
            )}
            {isEditModalOpen && currentEmployee && (
                <EditEmployeeModal
                    employee={currentEmployee}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleEditEmployee}
                />
            )}
        </div>
    );
};

export default EmployeeCardsPage;
