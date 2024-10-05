import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeesPage from '../Pages/EmployeesPage';
import InactiveEmployeesPage from '../Pages/InactiveEmployeesPage';
import EmployeeCardsPage from '../Pages/EmployeeCardsPage';
import MaterialsPage from '../Pages/MaterialsPage';
import WorkerWithdrawalsPage from '../Pages/WorkerWithdrawalsPage';
import SalariesPage from '../Pages/SalariesPage';
import WelcomePage from '../Pages/WelcomePage'; // استيراد صفحة الترحيب

const DashboardPage = () => {
    return (
        <div className="flex h-screen">
            <Routes>
                <Route path="/" element={<WelcomePage />} /> {/* المسار الافتراضي */}
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/inactive-employees" element={<InactiveEmployeesPage />} />
                <Route path="/employee-cards" element={<EmployeeCardsPage />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/worker-withdrawals" element={<WorkerWithdrawalsPage />} />
                <Route path="/salaries" element={<SalariesPage />} />
            </Routes>
        </div>
    );
};

export default DashboardPage;
