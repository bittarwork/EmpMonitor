import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import HomePage from './Pages/HomePage';
import DashboardPage from './dashboard/Dashboard'; // صفحة الـ Dashboard
import { UserProvider, UserContext } from './Context/UserContext';


function App() {
    return (
        <UserProvider>
            <MainApp />
        </UserProvider>
    );
}

function MainApp() {
    const { user } = useContext(UserContext); // هنا يتم استدعاء الـ useContext داخل MainApp بعد توفير UserProvider

    return (
        <Router>
            <Layout>
                <Routes>
                    {/* إذا كان المستخدم مسجلاً، يتم تحويله إلى الـ Dashboard */}
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <HomePage />} />
                    <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/" />} />
                </Routes>
            </Layout>
        </Router>
    );
}
export default App;
