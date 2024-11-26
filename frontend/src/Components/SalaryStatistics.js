import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalaryStatistics = () => {
    const [salaries, setSalaries] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/salary/salaries`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched data: ", data);
                setSalaries(data.salaries || []); // Ensure fallback to an empty array
            })            
            .catch((err) => {
                console.error("Error fetching data: ", err);
                setError(err.message);
            });
    }, []);

    if (error) {
        return <div className="text-red-500 text-center mt-4">خطأ: {error}</div>;
    }

    // Calculate total salary paid
    const totalSalaryPaid = salaries.reduce((acc, salary) => acc + salary.paidAmount, 0);

    // Calculate total remaining salary
    const totalRemainingSalary = salaries.reduce((acc, salary) => acc + salary.remainingAmount, 0);

    // Calculate average final salary
    const averageSalary = salaries.reduce((acc, salary) => acc + salary.finalSalary, 0) / salaries.length;

    // Salary settled vs unsettled
    const settledCount = salaries.filter(salary => salary.salarySettled).length;
    const unsettledCount = salaries.filter(salary => !salary.salarySettled).length;



    // Bar chart data for Salary Settled vs Unsettled
    const salarySettledData = {
        labels: ['Settled', 'Unsettled'],
        datasets: [
            {
                label: 'Salary Status',
                data: [settledCount, unsettledCount],
                backgroundColor: ['#4CAF50', '#FFC107'],
                borderColor: ['#4CAF50', '#FFC107'],
                borderWidth: 1,
            },
        ],
    };


    return (
        <div className="container mx-auto p-4">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">إحصائيات الرواتب</h1>

            {/* Statistics */}
            <div className="bg-white  rounded-lg p-6 space-y-6">
                {/* Total Salary Paid */}
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">إجمالي الرواتب المدفوعة:</span>
                    <span className="font-semibold">{totalSalaryPaid.toLocaleString('ar-EG', { style: 'currency', currency: 'SYP' })}</span>
                </div>

                {/* Total Remaining Salary */}
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">إجمالي الراتب المتبقي:</span>
                    <span className="font-semibold">{totalRemainingSalary.toLocaleString('ar-EG', { style: 'currency', currency: 'SYP' })}</span>
                </div>

                {/* Average Salary */}
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">متوسط الراتب النهائي:</span>
                    <span className="font-semibold">{averageSalary.toLocaleString('ar-EG', { style: 'currency', currency: 'SYP' })}</span>
                </div>

                {/* Visualizations */}
                <div className="flex  justify-center">

                    <div className="col-span-1">
                        <h2 className="text-xl font-semibold text-center">حالة الرواتب (مستقرة / غير مستقرة)</h2>
                        <Bar data={salarySettledData} options={{ responsive: true }} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SalaryStatistics;
