// src/Pages/WorkerWithdrawalsPage.js
import React, { useContext, useEffect, useState } from 'react';
import { useWithdrawalContext } from '../Context/WithdrawalContext'; // استخدم useWithdrawalContext
import { EmployeeContext } from '../Context/EmployeeContext';

const WorkerWithdrawalsPage = () => {
    const { fetchWithdrawalsByEmployee, withdrawals, addWithdrawal } = useWithdrawalContext(); // استخدام السياق
    const { employees } = useContext(EmployeeContext);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [material, setMaterial] = useState('');
    const [quantity, setQuantity] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (selectedEmployee) {
            fetchWithdrawalsByEmployee(selectedEmployee);
        }
    }, [selectedEmployee, fetchWithdrawalsByEmployee]);

    const handleSubmit = (e) => {
        e.preventDefault();
        addWithdrawal({ employee: selectedEmployee, material, quantity, note });
        setMaterial('');
        setQuantity('');
        setNote('');
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">سحوبات الموظف</h1>

            <div className="mb-6">
                <label htmlFor="employee" className="block text-sm font-medium text-gray-700">اختر الموظف</label>
                <select
                    id="employee"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">اختر موظفاً</option>
                    {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{`${emp.firstName} ${emp.lastName}`}</option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">إضافة سحب جديد</h2>

                <div className="mb-4">
                    <label htmlFor="material" className="block text-sm font-medium text-gray-700">المادة</label>
                    <input
                        type="text"
                        id="material"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">الكمية</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">ملاحظات</label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">
                    إضافة سحب
                </button>
            </form>

            <h2 className="text-xl font-semibold mb-4">سحوبات الموظف</h2>
            <ul>
                {withdrawals.map(withdrawal => (
                    <li key={withdrawal._id} className="border-b border-gray-300 py-2">
                        {`${withdrawal.material} - ${withdrawal.quantity} - ${withdrawal.note}`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorkerWithdrawalsPage;
