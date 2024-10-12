import React, { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext';
import EmployeeModal from '../models/EmployyeAddEdit'; // استيراد مكون المودال

const EmployeeCardsPage = () => {
    const {
        employees,
        fetchEmployees,
        loading,
        error,
        createEmployee,
        updateEmployee,
        deleteEmployee,
    } = useContext(EmployeeContext);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        firstName: '',
        lastName: '',
        fingerprint: '',
        contractStartDate: '',
        contractEndDate: '',
        hourlyRate: '',
        image: null,
    });

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const openModal = (employee = null) => {
        if (employee) {
            setSelectedEmployee(employee);
            setEmployeeData({
                firstName: employee.firstName,
                lastName: employee.lastName,
                fingerprint: employee.fingerprint,
                contractStartDate: employee.contractStartDate,
                contractEndDate: employee.contractEndDate,
                hourlyRate: employee.hourlyRate,
                image: null,
            });
            setIsEditing(true);
        } else {
            setSelectedEmployee(null);
            setEmployeeData({
                firstName: '',
                lastName: '',
                fingerprint: '',
                contractStartDate: '',
                contractEndDate: '',
                hourlyRate: '',
                image: null,
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
        setEmployeeData({
            firstName: '',
            lastName: '',
            fingerprint: '',
            contractStartDate: '',
            contractEndDate: '',
            hourlyRate: '',
            image: null,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({
            ...employeeData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setEmployeeData({
            ...employeeData,
            image: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateEmployee(selectedEmployee.id, employeeData);
        } else {
            await createEmployee(employeeData);
        }
        closeModal();
        fetchEmployees();
    };

    const handleDelete = (id) => {
        deleteEmployee(id).then(() => {
            fetchEmployees();
        });
    };



    return (
        <div className="flex flex-col flex-grow pb-10">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">بطاقات الموظفين</h1>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md">
                    إضافة موظف جديد
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-700 text-lg">جاري التحميل...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {employees.map((employee) => (
                        <div key={employee._id} className="bg-white p-6 rounded-md shadow-md">
                            <h2 className="text-xl font-bold">{`${employee.firstName} ${employee.lastName}`}</h2>
                            <p>البصمة: {employee.fingerprint}</p>
                            <p>تاريخ بدء العقد: {employee.contractStartDate}</p>
                            <p>تاريخ انتهاء العقد: {employee.contractEndDate}</p>
                            <p>الأجر بالساعة: {employee.hourlyRate}</p>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => openModal(employee)}
                                    className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition duration-300">
                                    تعديل
                                </button>
                                <button
                                    onClick={() => handleDelete(employee.id)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition duration-300">
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* عرض المودال عند فتحه */}
            {isModalOpen && (
                <EmployeeModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    employeeData={employeeData}
                    onInputChange={handleInputChange}
                    onImageChange={handleImageChange}
                    onSubmit={handleSubmit}
                    isEditing={isEditing}
                />
            )}
        </div>
    );
};

export default EmployeeCardsPage;
