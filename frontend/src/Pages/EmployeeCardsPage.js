import React, { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../Context/employeeContext';
import EmployeeModal from '../models/EmployyeAddEdit';
import EmployeeCard from '../Components/EmployeeCard';

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

    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredEmployees = employees.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col flex-grow pb-10 " dir='rtl'>
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">بطاقات الموظفين</h1>

            {/* عرض الخطأ إذا كان موجوداً */}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="flex mt-4 md:mt-0 w-full mb-6">
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                >
                    إضافة موظف جديد
                </button>

                <input
                    type="text"
                    placeholder="بحث عن موظف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 mr-5 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-2/3 ml-2"
                />
            </div>

            {loading ? (
                <div className="text-center text-gray-700 text-lg">جاري التحميل...</div>
            ) : (
                <div className="overflow-auto" >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6">
                        {filteredEmployees.map((employee) => (
                            <EmployeeCard
                                key={employee.id}
                                employee={employee}
                                onEdit={openModal}
                                onDelete={handleDelete}
                                className="transition-transform duration-300 transform hover:scale-105"
                            />
                        ))}
                    </div>
                </div>
            )}

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
