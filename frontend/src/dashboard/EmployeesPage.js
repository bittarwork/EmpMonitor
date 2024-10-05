// src/dashboard/EmployeesPage.js
import React, { useContext, useEffect } from 'react';
import { EmployeeContext } from '../Context/EmployeeContext';

const EmployeesPage = () => {
    const { state, fetchEmployees } = useContext(EmployeeContext);
    const { employees, loading, error } = state;

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    if (loading) return <div>جارٍ التحميل...</div>;
    if (error) return <div>خطأ: {error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">قائمة الموظفين</h2>
            <ul>
                {employees.map(employee => (
                    <li key={employee._id} className="p-2 border-b">
                        {employee.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeesPage;
