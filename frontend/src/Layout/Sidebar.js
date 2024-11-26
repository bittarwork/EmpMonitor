import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

const Sidebar = () => {
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation(); // لمعرفة الصفحة الحالية

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    if (!user) {
        return null;
    }

    const navLinks = [
        { path: '/dashboard', label: 'الرئيسية', icon: '🏠' },
        { path: '/dashboard/employees', label: 'موظفين فعالين', icon: '👥' },
        { path: '/dashboard/inactive-employees', label: 'موظفين متوقفين', icon: '❌' },
        { path: '/dashboard/employee-cards', label: 'بطاقات الموظفين', icon: '💳' },
        { path: '/dashboard/materials', label: 'المواد', icon: '📦' },
        { path: '/dashboard/worker-withdrawals', label: 'مسحوبات العمال', icon: '💼' },
        { path: '/dashboard/salaries', label: 'الرواتب والأجور', icon: '💰' },
        { path: '/dashboard/statistics', label: 'الاحصائيات العامة', icon: '📈' },
    ];

    return (
        <div className={`bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
            <button
                onClick={toggleSidebar}
                className="bg-gray-700 p-2 rounded-md m-4 text-center"
                title="Toggle Sidebar"
            >
                {isOpen ? '◀' : '▶'}
            </button>

            <nav className={`flex flex-col ${isOpen ? 'space-y-4' : 'space-y-2'} p-4`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center text-lg p-2 rounded transition duration-200 ${location.pathname === link.path
                            ? 'bg-blue-600 text-white font-bold'
                            : 'hover:bg-gray-700'
                            }`}
                    >
                        {link.icon} {isOpen && <span className="ml-2">{link.label}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
