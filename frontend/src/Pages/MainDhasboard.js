import React, { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../Context/employeeContext';
import EmployeeModal from '../models/EmployeeModal';

const EmployeePage = () => {
    const {
        employees,
        fetchEmployees,
        loading,
        error,
    } = useContext(EmployeeContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);


    const getContractStatus = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) {
            return <span className="text-red-500">❎ العقد منتهي</span>;
        } else if (daysDiff <= 2) {
            return <span className="text-yellow-500">⏰ العقد سينتهي قريباً</span>;
        } else {
            return <span className="text-green-500">✅ العقد ساري</span>;
        }
    };

    const getTodayAttendance = (attendances) => {
        const today = new Date().toISOString().split('T')[0];

        const todaysAttendances = attendances.filter((attendance) => {
            if (!attendance.checkTime) return false;
            const attendanceDate = new Date(attendance.checkTime);
            if (isNaN(attendanceDate.getTime())) return false;
            return attendanceDate.toISOString().split('T')[0] === today;
        });

        if (todaysAttendances.length > 0) {
            todaysAttendances.sort((a, b) => new Date(a.checkTime) - new Date(b.checkTime));

            const checkInTime = todaysAttendances[0].checkTime;
            const checkOutTime = todaysAttendances[todaysAttendances.length - 1].checkTime;

            return {
                checkInTime: checkInTime ? new Date(checkInTime).toLocaleTimeString() : 'لم يتم الدخول',
                checkOutTime: checkOutTime ? new Date(checkOutTime).toLocaleTimeString() : 'لم يتم الخروج'
            };
        }

        return { checkInTime: 'اليوم لم يتم الدخول', checkOutTime: 'اليوم لم يتم الخروج' };
    };

    const filteredEmployees = employees.filter(employee => {
        const { checkInTime, checkOutTime } = getTodayAttendance(employee.mockAttendances);

        // عرض الموظف فقط إذا كان قد سجل الدخول أو الخروج اليوم
        return (checkInTime !== 'اليوم لم يتم الدخول' || checkOutTime !== 'اليوم لم يتم الخروج') &&
            `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const openModal = (employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    return (
        <div className="flex flex-col flex-grow pb-10 px-4" dir='rtl'>
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">إدارة الموظفين</h1>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex mt-4 md:mt-0 space-x-4 w-full">
                    <input
                        type="text"
                        placeholder="بحث عن الموظف"
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-2/3 ml-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={fetchEmployees}
                        className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md">
                        تحديث
                    </button>
                    <button
                        onClick={() => { }}
                        className="bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition duration-300 shadow-md">
                        فرز حسب الاسم
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-700 text-lg">جاري التحميل...</div>
            ) : (
                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full bg-white rounded-md shadow-md">
                        <thead className="bg-blue-300">
                            <tr>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">اسم الموظف</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">حالة العامل</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">ساعة الدخول</th>
                                <th className="border-b px-4 py-4 text-right text-gray-600 sticky top-0">ساعة الخروج</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => {
                                const { checkInTime, checkOutTime } = getTodayAttendance(employee.mockAttendances);

                                return (
                                    <tr key={employee.id} className="hover:bg-blue-100 transition duration-200 cursor-pointer" onClick={() => openModal(employee)}>
                                        <td className="border-b text-right px-4 py-4 text-gray-700">{`${employee.firstName} ${employee.lastName}`}</td>
                                        <td className="border-b text-right px-4 py-4 text-gray-700 flex items-center">
                                            {getContractStatus(employee.contractEndDate)}
                                        </td>
                                        <td className="border-b px-4 py-4 text-gray-700">{checkInTime}</td>
                                        <td className="border-b px-4 py-4 text-gray-700">{checkOutTime}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <EmployeeModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default EmployeePage;
