// src/dashboard/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-64 h-full bg-gray-800 text-white">
            <h2 className="text-xl font-bold p-4">لوحة التحكم</h2>
            <ul className="flex flex-col p-4">
                <li className="mb-2">
                    <Link to="/dashboard/employees" className="block p-2 hover:bg-gray-700">
                        الموظفين
                    </Link>
                </li>
                {/* أضف المزيد من الروابط للمكونات الأخرى هنا */}
            </ul>
        </div>
    );
};

export default Sidebar;
