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

    // دالة لحساب إذا كان عقد الموظف سينتهي قريباً
    const isContractEndingSoon = (contractEndDate) => {
        const endDate = new Date(contractEndDate);
        const today = new Date();
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff <= 1 && daysDiff >= 0;
    };

    // دالة لاستخراج وقت الدخول والخروج لهذا اليوم
    const getTodayAttendance = (attendances) => {
        const today = new Date().toISOString().split('T')[0]; // الحصول على التاريخ اليوم بصيغة "YYYY-MM-DD"

        // فلترة الحضور لتحديد الحضور الذي يطابق تاريخ اليوم فقط
        const todaysAttendances = attendances.filter((attendance) => {
            // التحقق من وجود تاريخ صحيح في البيانات
            if (!attendance.checkTime) return false; // إذا لم يوجد تاريخ، يتم تجاهل السجل
            const attendanceDate = new Date(attendance.checkTime);

            // إذا كان التاريخ غير صالح، يتم تجاهل السجل
            if (isNaN(attendanceDate.getTime())) return false;

            // مقارنة التاريخ مع اليوم
            return attendanceDate.toISOString().split('T')[0] === today;
        });

        // إذا كان هناك سجلات حضور لهذا اليوم
        if (todaysAttendances.length > 0) {
            // ترتيب الحضور حسب الوقت (من الأقدم إلى الأحدث)
            todaysAttendances.sort((a, b) => new Date(a.checkTime) - new Date(b.checkTime));

            const checkInTime = todaysAttendances[0].checkTime; // أول حضور كدخول
            const checkOutTime = todaysAttendances[todaysAttendances.length - 1].checkTime; // آخر حضور كخروج

            // إذا كان هناك فرق في الحضور
            return {
                checkInTime: checkInTime ? new Date(checkInTime).toLocaleTimeString() : 'لم يتم الدخول',
                checkOutTime: checkOutTime ? new Date(checkOutTime).toLocaleTimeString() : 'لم يتم الخروج'
            };
        }

        return { checkInTime: 'اليوم لم يتم الدخول', checkOutTime: 'اليوم لم يتم الخروج' };
    };


    const filteredEmployees = employees.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                    <tr key={employee._id} className="hover:bg-blue-100 transition duration-200 cursor-pointer" onClick={() => openModal(employee)}>
                                        <td className="border-b text-right px-4 py-4 text-gray-700">{`${employee.firstName} ${employee.lastName}`}</td>
                                        <td className="border-b text-right px-4 py-4 text-gray-700 flex items-center">
                                            {isContractEndingSoon(employee.contractEndDate) ? (
                                                <span className="text-red-500 flex items-center">
                                                    ⚠️ عقد ينتهي خلال يومين
                                                </span>
                                            ) : (
                                                <span className="text-green-500">✅ العقد ساري</span>
                                            )}
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
                onRequestClose={closeModal}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default EmployeePage;
