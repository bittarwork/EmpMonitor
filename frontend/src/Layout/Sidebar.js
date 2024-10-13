import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

const Sidebar = () => {
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(true); // حالة للتحكم في فتح/إغلاق الـ Sidebar

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // تغيير الحالة عند النقر على زر التبديل
    };

    if (!user) {
        return null; // لا يظهر الـ Sidebar إذا لم يكن هناك مستخدم
    }

    return (
        <div className={`bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
            {/* زر الـ Toggle */}
            <button
                onClick={toggleSidebar}
                className="bg-gray-700 p-2 rounded-md m-4 text-center"
                title="Toggle Sidebar"
            >
                {isOpen ? '◀' : '▶'} {/* تبديل الرمز حسب حالة الـ Sidebar */}
            </button>

            <nav className={`flex flex-col ${isOpen ? 'space-y-4' : 'space-y-2'} p-4`}>
                <Link to="/dashboard" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                    🏠 {isOpen && <span className="ml-2">الرئيسية</span>}
                </Link>
                <Link to="/dashboard/employees" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                    👥 {isOpen && <span className="ml-2">موظفين فعالين</span>}
                </Link>
                <Link to="/dashboard/inactive-employees" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                    ❌ {isOpen && <span className="ml-2">موظفين متوقفين</span>}
                </Link>
                <Link to="/dashboard/employee-cards" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                    💳 {isOpen && <span className="ml-2">بطاقات الموظفين</span>}
                </Link>
                <Link to="/dashboard/materials" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                    📦 {isOpen && <span className="ml-2">المواد</span>}
                </Link>
                <Link to="/dashboard/worker-withdrawals" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                    💼 {isOpen && <span className="ml-2">مسحوبات العمال</span>}
                </Link>
                <Link to="/dashboard/salaries" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                    💰 {isOpen && <span className="ml-2">الرواتب والأجور</span>}
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
