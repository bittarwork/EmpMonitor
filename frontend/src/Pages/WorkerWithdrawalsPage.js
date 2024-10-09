import React, { useEffect, useState, useContext } from 'react';
import { useWithdrawals } from '../Context/WithdrawalContext';
import { EmployeeContext } from '../Context/EmployeeContext';
import { useMaterialContext } from '../Context/MaterialContext';

const WorkerWithdrawalsPage = () => {
    const {
        withdrawals,
        fetchWithdrawalsGroupedByEmployee,
        createWithdrawal,
        updateWithdrawal,
        deleteWithdrawal,
    } = useWithdrawals();

    const { employees, fetchEmployees, loading: loadingEmployees, error: employeeError } = useContext(EmployeeContext);
    const { state: materialState, fetchMaterials } = useMaterialContext();

    const [newWithdrawal, setNewWithdrawal] = useState({
        employee: '',
        material: '',
        quantity: '',
        note: '',
    });

    const [editingWithdrawal, setEditingWithdrawal] = useState(null);

    // Fetch data once when component is mounted
    useEffect(() => {
        // Fetch withdrawals, employees, and materials when the component mounts
        fetchWithdrawalsGroupedByEmployee();
        fetchEmployees();
        fetchMaterials();
    }, []); // Empty array ensures this only runs once on mount

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewWithdrawal((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingWithdrawal) {
            const updatedData = {
                employee: editingWithdrawal.employeeId,
                material: editingWithdrawal.materialId,
                quantity: newWithdrawal.quantity,
                note: newWithdrawal.note,
            };
            updateWithdrawal(editingWithdrawal.withdrawalId, updatedData);
        } else {
            const newData = {
                employee: newWithdrawal.employee,
                material: newWithdrawal.material,
                quantity: newWithdrawal.quantity,
                note: newWithdrawal.note,
            };
            createWithdrawal(newData);
        }
        setNewWithdrawal({ employee: '', material: '', quantity: '', note: '' });
        setEditingWithdrawal(null);
    };

    const handleEdit = (withdrawal) => {
        setEditingWithdrawal(withdrawal);
        setNewWithdrawal({
            employee: withdrawal.employeeId,
            material: withdrawal.materialId,
            quantity: withdrawal.quantity,
            note: withdrawal.note,
        });
    };

    const handleDelete = (id) => {
        deleteWithdrawal(id);
    };

    if (loadingEmployees || materialState.loading) {
        return <div>Loading...</div>;
    }

    if (employeeError || materialState.error) {
        return <div>Error loading data.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-2xl font-bold mb-5">Employee Withdrawals</h1>

            <form onSubmit={handleSubmit} className="mb-5 bg-gray-100 p-4 rounded">
                <h2 className="text-xl mb-3">{editingWithdrawal ? 'Edit Withdrawal' : 'Add Withdrawal'}</h2>
                <div className="flex flex-col space-y-4">
                    {/* Employee Selection */}
                    <select
                        name="employee"
                        value={newWithdrawal.employee}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    >
                        <option value="" disabled>Select Employee</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName}
                            </option>
                        ))}
                    </select>

                    {/* Material Selection */}
                    <select
                        name="material"
                        value={newWithdrawal.material}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    >
                        <option value="" disabled>Select Material</option>
                        {materialState.materials.map((material) => (
                            <option key={material._id} value={material._id}>
                                {material.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="quantity"
                        value={newWithdrawal.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        required
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="note"
                        value={newWithdrawal.note}
                        onChange={handleChange}
                        placeholder="Notes"
                        className="border p-2 rounded"
                    />

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {editingWithdrawal ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>

            {/* Display Withdrawals */}
            <div className="overflow-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Material Name</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">Notes</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals && withdrawals.length > 0 ? (
                            withdrawals.map((withdrawal) => (
                                withdrawal.withdrawals && withdrawal.withdrawals.length > 0 ? (
                                    withdrawal.withdrawals.map((item) => (
                                        <tr key={item.withdrawalId} className="border-b">
                                            <td className="border px-4 py-2">{item.materialName}</td>
                                            <td className="border px-4 py-2">{item.materialPrice}</td>
                                            <td className="border px-4 py-2">{item.quantity}</td>
                                            <td className="border px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">{item.note}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    onClick={() => handleEdit({ ...item, employeeId: withdrawal.employeeId })}
                                                    className="bg-yellow-500 text-white p-1 rounded mx-1"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.withdrawalId)}
                                                    className="bg-red-500 text-white p-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={withdrawal.employeeId}><td colSpan={6}>No withdrawals found for this employee.</td></tr>
                                )
                            ))
                        ) : (
                            <tr><td colSpan={6}>No withdrawals available.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkerWithdrawalsPage;
