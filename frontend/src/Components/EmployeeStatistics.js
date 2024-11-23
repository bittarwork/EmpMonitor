import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const EmployeeStatistics = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
                setEmployees(response.data);
                setLoading(false);
            } catch (err) {
                setError("فشل في تحميل بيانات الموظفين.");
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <p className="text-center text-lg font-semibold text-gray-600">جاري التحميل...</p>;
    if (error) return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;

    // حساب الإحصائيات
    const totalEmployees = employees.length;
    const today = new Date();
    const employeesWithActiveContracts = employees.filter(
        (emp) => new Date(emp.contractEndDate) > today
    );
    const employeesWithExpiringContracts = employees.filter(
        (emp) => new Date(emp.contractEndDate) <= new Date(today.setDate(today.getDate() + 7))
    );
    const averageHourlyRate = employees.reduce((sum, emp) => sum + emp.hourlyRate, 0) / employees.length || 0;

    // بيانات الحضور للرسم البياني
    const attendancePerEmployee = employees.map((emp) => ({
        name: `${emp.firstName} ${emp.lastName}`,
        attendanceCount: emp.mockAttendances.length,
    }));

    const totalWithdrawals = employees.reduce((sum, emp) => {
        return sum + emp.withdrawals.reduce((innerSum, withdrawal) => innerSum + withdrawal.quantity, 0);
    }, 0);

    // إعدادات الرسم البياني
    const chartData = {
        labels: attendancePerEmployee.map((emp) => emp.name),
        datasets: [
            {
                label: "عدد الحضور",
                data: attendancePerEmployee.map((emp) => emp.attendanceCount),
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
            },
        ],
    };

    const contractStatusData = {
        labels: ["العقود الفعّالة", "العقود القريبة من الانتهاء"],
        datasets: [
            {
                data: [employeesWithActiveContracts.length, employeesWithExpiringContracts.length],
                backgroundColor: ["#34D399", "#FBBF24"],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="bg-gray-50 p-6 mb-10 rounded-lg" dir="rtl">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">إحصائيات الموظفين</h2>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-lg font-bold text-gray-600">إجمالي الموظفين</h3>
                    <p className="text-3xl font-extrabold text-blue-500">{totalEmployees}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-lg font-bold text-gray-600">العقود الفعّالة</h3>
                    <p className="text-3xl font-extrabold text-green-500">{employeesWithActiveContracts.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-lg font-bold text-gray-600">العقود القريبة من الانتهاء</h3>
                    <p className="text-3xl font-extrabold text-yellow-500">{employeesWithExpiringContracts.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-lg font-bold text-gray-600">متوسط الأجر بالساعة</h3>
                    <p className="text-3xl font-extrabold text-purple-500">{averageHourlyRate.toFixed(2)} SYP</p>
                </div>
            </div>
            <div className="bg-white p-6 mb-6 rounded-lg shadow mt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">إجمالي السحوبات</h3>
                <p className="text-3xl font-extrabold text-red-500">{totalWithdrawals} وحدة</p>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">إحصائيات الحضور</h3>
                    <Bar data={chartData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">حالة العقود</h3>
                    <Pie data={contractStatusData} />
                </div>
            </div>


        </div>
    );
};

export default EmployeeStatistics;
