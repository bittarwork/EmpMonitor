// src/Pages/WorkerWithdrawalsPage.js

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useWithdrawals } from '../Context/WithdrawalContext'; // استيراد hook useWithdrawals
import { EmployeeContext } from '../Context/EmployeeContext'; // استيراد الـ Context الخاص بالموظفين
import { useMaterialContext } from '../Context/MaterialContext'; // استيراد hook useMaterialContext
import EmployeeWithdrawals from '../Components/EmployeeWithdrawals'; // استيراد مكون عرض المسحوبات

const WorkerWithdrawalsPage = () => {
    const { withdrawals, fetchWithdrawalsGroupedByEmployee, deleteWithdrawal, createWithdrawal } = useWithdrawals();
    const { employees, fetchEmployees } = useContext(EmployeeContext);
    const { state: materialState, fetchMaterials } = useMaterialContext(); // استخدام hook لجلب المواد

    // الحالة الخاصة بنموذج الإضافة
    const [formData, setFormData] = useState({
        employeeId: '',
        materialId: '',
        quantity: '',
        note: '',
    });

    // استخدام useCallback لتحسين أداء الدوال
    const fetchAllData = useCallback(() => {
        fetchWithdrawalsGroupedByEmployee(); // جلب السحوبات
        fetchEmployees(); // جلب الموظفين
        fetchMaterials(); // جلب المواد
    }, [fetchWithdrawalsGroupedByEmployee, fetchEmployees, fetchMaterials]);

    // جلب السحوبات وجلب الموظفين والمواد عند تحميل الصفحة
    useEffect(() => {
        fetchAllData(); // استدعاء الدالة المحسنة
    }, []);

    // التعامل مع تغييرات النموذج
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { employeeId, materialId, quantity, note } = formData;

        if (!employeeId || !materialId || quantity <= 0) {
            alert("Please fill in all fields with valid values.");
            return;
        }

        try {
            const response = await createWithdrawal({
                employee: employeeId,
                material: materialId,
                quantity: Number(quantity),
                note: note,
            });

            if (response && response.message === "Withdrawal created successfully") {
                alert("Withdrawal added successfully!");
            } else {
                alert("Failed to add withdrawal. Please try again.");
            }
        } catch (error) {
            console.error("Error creating withdrawal:", error);
            alert("An error occurred while creating the withdrawal. Please check the console for details.");
        }

        setFormData({
            employeeId: '',
            materialId: '',
            quantity: '',
            note: '',
        });

        fetchAllData();
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Employee Withdrawals</h1>

            {/* نموذج لإضافة سحب جديد */}
            <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-4">Add New Withdrawal</h2>
                <label className="block mb-2">
                    Employee:
                    <select name="employeeId" value={formData.employeeId} onChange={handleChange} required className="block w-full border border-gray-300 rounded p-2 mt-1">
                        <option value="">Select Employee</option>
                        {employees && employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{`${emp.firstName} ${emp.lastName}`}</option>
                        ))}
                    </select>
                </label>
                <label className="block mb-2">
                    Material:
                    <select name="materialId" value={formData.materialId} onChange={handleChange} required className="block w-full border border-gray-300 rounded p-2 mt-1">
                        <option value="">Select Material</option>
                        {materialState.materials && materialState.materials.map(mat => (
                            <option key={mat._id} value={mat._id}>{mat.name}</option> // تأكد من استخدام mat._id
                        ))}
                    </select>
                </label>
                <label className="block mb-2">
                    Quantity:
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="block w-full border border-gray-300 rounded p-2 mt-1" />
                </label>
                <label className="block mb-2">
                    Note:
                    <textarea name="note" value={formData.note} onChange={handleChange} className="block w-full border border-gray-300 rounded p-2 mt-1"></textarea>
                </label>
                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Withdrawal</button>
            </form>

            {/* منطقة عرض المعلومات مع سكرول */}
            <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-300">
                {withdrawals.length === 0 ? (
                    <p>No withdrawals found.</p>
                ) : (
                    withdrawals.map((group) => (
                        <EmployeeWithdrawals key={group.employeeId} employee={employees.find(emp => emp.id === group.employeeId)} withdrawals={group.withdrawals} />
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkerWithdrawalsPage;
