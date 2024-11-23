import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ActiveEmployeesPage from '../Pages/ActiveEmployeesPage';
import InactiveEmployeesPage from '../Pages/InactiveEmployeesPage';
import EmployeeCardsPage from '../Pages/EmployeeCardsPage';
import MaterialsPage from '../Pages/MaterialsPage';
import WorkerWithdrawalsPage from '../Pages/WorkerWithdrawalsPage';
import SalariesPage from '../Pages/SalariesPage';
import MainDhasboard from '../Pages/MainDhasboard';
import Statistics from '../Pages/Statistics';

const DashboardPage = () => {
    return (
        <div className="flex h-screen">
            <Routes>
                <Route path="/" element={<MainDhasboard />} />
                <Route path="/employees" element={<ActiveEmployeesPage />} />
                <Route path="/inactive-employees" element={<InactiveEmployeesPage />} />
                <Route path="/employee-cards" element={<EmployeeCardsPage />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/worker-withdrawals" element={<WorkerWithdrawalsPage />} />
                <Route path="/salaries" element={<SalariesPage />} />
                <Route path="/statistics" element={<Statistics />} />
            </Routes>
        </div>
    );
};

export default DashboardPage;
