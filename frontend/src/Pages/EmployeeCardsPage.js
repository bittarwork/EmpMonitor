import React, { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext';
import EmployeeCard from '../Components/EmployeeCard';
import AddEmployeeModal from '../models/AddEmployeeModal';
import EditEmployeeModal from '../models/EditEmployeeModal';

const EmployeeCardsPage = () => {
    const { employees: contextEmployees, createEmployee, updateEmployee, deleteEmployee } = useContext(EmployeeContext);
    const [employees, setEmployees] = useState(contextEmployees);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setEmployees(contextEmployees);
    }, [contextEmployees]);

    const handleAddEmployee = async (employeeData) => {
        const newEmployee = await createEmployee(employeeData);
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
        setIsModalOpen(false);
    };

    const handleEditEmployee = async (employeeData) => {
        if (currentEmployee) {
            await updateEmployee(currentEmployee.id, employeeData);
            setIsEditModalOpen(false);
            setCurrentEmployee(null);
            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.id === currentEmployee.id ? { ...employee, ...employeeData } : employee
                )
            );
        }
    };

    const handleDeleteEmployee = async (id) => {
        await deleteEmployee(id);
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
    };

    const openEditModal = (employee) => {
        setCurrentEmployee(employee);
        setIsEditModalOpen(true);
    };

    const filteredEmployees = employees.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-w-full">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">إدارة الموظفين</h1>
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="ابحث عن موظف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded-lg p-2 w-1/3"
                />
            </div>
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                >
                    إضافة موظف جديد
                </button>
            </div>
            <div className="grid grid-cols-2 overflow-y-auto gap-5 max-h-[70vh]">
                {filteredEmployees.map((employee) => (
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
