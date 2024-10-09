// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import HomePage from './Pages/HomePage';
import DashboardPage from './dashboard/Dashboard';
import { UserProvider, UserContext } from './Context/UserContext';
import { EmployeeProvider } from './Context/EmployeeContext';
import { MaterialProvider } from './Context/MaterialContext';
import { WithdrawalProvider } from './Context/WithdrawalContext';

function App() {
    return (
        <WithdrawalProvider>
            <UserProvider>
                <EmployeeProvider>
                    <MaterialProvider>
                        <MainApp />
                    </MaterialProvider>
                </EmployeeProvider>
            </UserProvider>
        </WithdrawalProvider>
    );
}

function MainApp() {
    const { user } = useContext(UserContext);

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <HomePage />} />
                    <Route path="/dashboard/*" element={user ? <DashboardPage /> : <Navigate to="/" />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
