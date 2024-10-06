import React, { useState, useContext } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext'; // تأكد من تعديل المسار حسب مكان وجود الملف
import EmployeeCard from '../Components/EmployeeCard';
import Modal from '../models/Modal';

const EmployeeCardsPage = () => {
    const { employees, createEmployee, updateEmployee, deleteEmployee } = useContext(EmployeeContext);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleAddEmployee = (newEmployee) => {
        createEmployee(newEmployee);
        setIsAddModalOpen(false);
    };

    const handleEditEmployee = (updatedEmployee) => {
        updateEmployee(selectedEmployee.id, updatedEmployee);
        setIsEditModalOpen(false);
        setSelectedEmployee(null);
    };

    const handleDeleteEmployee = (id) => {
        deleteEmployee(id);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Employee Cards</h1>
            <div className="overflow-auto max-h-[500px]"> {/* ضبط الحد الأقصى للارتفاع مع التمرير */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map(employee => (
                        <EmployeeCard
                            key={employee.id}
                            employee={employee}
                            onViewMore={(id) => { /* هنا يمكنك فتح نافذة عرض المزيد */ }}
                            onEdit={(employee) => { setSelectedEmployee(employee); setIsEditModalOpen(true); }}
                            onDelete={handleDeleteEmployee}
                        />
                    ))}
                </div>
            </div>
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-500 text-white rounded px-4 py-2 mt-4"
            >
                Add Employee
            </button>

            {/* نافذة إضافة موظف */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <h2 className="text-xl font-semibold">Add New Employee</h2>
                {/* نموذج إضافة الموظف */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const newEmployee = {
                        // اجمع بيانات الموظف من النموذج
                    };
                    handleAddEmployee(newEmployee);
                }}>
                    {/* حقول النموذج مثل الاسم، اللقب، صورة، إلخ */}
                    <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-4">Add</button>
                </form>
            </Modal>

            {/* نافذة تعديل موظف */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <h2 className="text-xl font-semibold">Edit Employee</h2>
                {/* نموذج تعديل الموظف */}
                {selectedEmployee && (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const updatedEmployee = {
                            // اجمع بيانات الموظف المحدثة من النموذج
                        };
                        handleEditEmployee(updatedEmployee);
                    }}>
                        {/* حقول النموذج مثل الاسم، اللقب، صورة، إلخ */}
                        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-4">Update</button>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default EmployeeCardsPage;