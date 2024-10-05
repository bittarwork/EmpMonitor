// src/dashboard/Dashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import EmployeesPage from './EmployeesPage'; // استيراد الصفحة الخاصة بالموظفين

const DashboardPage = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-4">
                <Routes>
                    <Route path="employees" element={<EmployeesPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default DashboardPage;
