import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkerWithdrawalsPage = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [newWithdrawal, setNewWithdrawal] = useState({
        employee: '',
        material: '',
        quantity: 1,
        note: ''
    });
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null); // حالة جديدة للتحديث

    useEffect(() => {
        const fetchData = async () => {
            try {
                const withdrawalResponse = await axios.get(`${process.env.REACT_APP_API_URL}/withdrawals`);
                const employeeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
                const materialResponse = await axios.get(`${process.env.REACT_APP_API_URL}/materials`);

                setWithdrawals(withdrawalResponse.data);
                setEmployees(employeeResponse.data);
                setMaterials(materialResponse.data);
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewWithdrawal((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (withdrawal) => {
        setNewWithdrawal({
            employee: withdrawal.employee,
            material: withdrawal.material,
            quantity: withdrawal.quantity,
            note: withdrawal.note
        });
        setSelectedWithdrawal(withdrawal);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e);
        if (selectedWithdrawal) {
            // تحديث السحب الموجود
            try {
                const response = await axios.put(
                    `${process.env.REACT_APP_API_URL}/withdrawals/${selectedWithdrawal.withdrawalId}`,
                    newWithdrawal
                );
                setSuccessMessage('Withdrawal updated successfully');
                setError(null);

                setWithdrawals((prev) => prev.map((ew) =>
                    ew.employeeId === response.data.withdrawal.employee ? {
                        ...ew,
                        withdrawals: ew.withdrawals.map(w =>
                            w.withdrawalId === selectedWithdrawal.withdrawalId
                                ? response.data.withdrawal
                                : w
                        )
                    } : ew
                ));

                setNewWithdrawal({ employee: '', material: '', quantity: 1, note: '' });
                setSelectedWithdrawal(null);
            } catch (err) {
                setError('Error updating withdrawal');
            }
        } else {
            // إضافة سحب جديد
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/withdrawals`, newWithdrawal);
                setSuccessMessage('Withdrawal added successfully');
                setError(null);

                const existingWithdrawalIndex = withdrawals.findIndex(
                    (w) => w.employeeId === newWithdrawal.employee
                );

                if (existingWithdrawalIndex !== -1) {
                    setWithdrawals((prev) => {
                        const updatedWithdrawals = [...prev];
                        updatedWithdrawals[existingWithdrawalIndex].withdrawals.push(response.data.withdrawal);
                        return updatedWithdrawals;
                    });
                } else {
                    const newEmployeeWithdrawals = {
                        employeeId: newWithdrawal.employee,
                        withdrawals: [response.data.withdrawal],
                    };
                    setWithdrawals((prev) => [...prev, newEmployeeWithdrawals]);
                }

                setNewWithdrawal({ employee: '', material: '', quantity: 1, note: '' });
            } catch (err) {
                setError('Error adding withdrawal');
            }
        }
    };

    const handleDeleteWithdrawal = async (withdrawalId) => {
        if (!withdrawalId) {
            console.error("Invalid withdrawal ID");
            return;
        }

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/withdrawals/${withdrawalId}`);
            setSuccessMessage('Withdrawal deleted successfully');
            setError(null);

            setWithdrawals((prev) =>
                prev.map(employeeWithdrawals => ({
                    ...employeeWithdrawals,
                    withdrawals: employeeWithdrawals.withdrawals.filter(w => w.withdrawalId !== withdrawalId)
                }))
            );
        } catch (err) {
            setError('Error deleting withdrawal');
        }
    };

    const handleDeleteAllWithdrawals = async (employeeId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/withdrawals/employee/${employeeId}`);
            setSuccessMessage('All withdrawals for this employee have been deleted');
            setError(null);

            setWithdrawals((prev) => prev.filter((ew) => ew.employeeId !== employeeId));
        } catch (err) {
            setError('Error deleting all withdrawals');
        }
    };

    const getEmployeeName = (id) => {
        const employee = employees.find(emp => emp.id === id);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
    };

    const getMaterialName = (id) => {
        const material = materials.find(mat => mat._id === id);
        return material ? material.name : 'Unknown Material';
    };

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Withdrawals</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg shadow-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-2">{selectedWithdrawal ? 'Update Withdrawal' : 'Add New Withdrawal'}</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Employee</label>
                    <select
                        name="employee"
                        value={newWithdrawal.employee}
                        onChange={handleChange}
                        required
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="" disabled>Select an employee</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {`${employee.firstName} ${employee.lastName}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Material</label>
                    <select
                        name="material"
                        value={newWithdrawal.material}
                        onChange={handleChange}
                        required
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="" disabled>Select a material</option>
                        {materials.map(material => (
                            <option key={material._id} value={material._id}>
                                {material.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={newWithdrawal.quantity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="border rounded-lg p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Note</label>
                    <textarea
                        name="note"
                        value={newWithdrawal.note}
                        onChange={handleChange}
                        className="border rounded-lg p-2 w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4">
                    {selectedWithdrawal ? 'Update Withdrawal' : 'Add Withdrawal'}
                </button>
            </form>

            {withdrawals.length === 0 ? (
                <p className="text-center">No withdrawals found for this employee.</p>
            ) : (
                withdrawals.map((employeeWithdrawals) => (
                    <div key={employeeWithdrawals.employeeId} className="border p-4 mb-4 rounded-lg shadow-lg bg-white">
                        <h2 className="text-xl font-semibold mb-2">Employee: {getEmployeeName(employeeWithdrawals.employeeId)}</h2>
                        <button
                            onClick={() => handleDeleteAllWithdrawals(employeeWithdrawals.employeeId)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-1 px-3 mb-3"
                        >
                            Delete All Withdrawals for this Employee
                        </button>
                        <ul className="list-disc ml-5">
                            {employeeWithdrawals.withdrawals.map((withdrawal, index) => (
                                <li key={Math.random().toString(36).substr(2, 9) + index} className="mb-2">
                                    <p className="font-medium">Material Name: <span className="font-normal">{getMaterialName(withdrawal.material)}</span></p>
                                    <p>Quantity: <span className="font-normal">{withdrawal.quantity}</span></p>
                                    <p>Note: <span className="font-normal">{withdrawal.note}</span></p>
                                    <p>Date: <span className="font-normal">{new Date(withdrawal.date).toLocaleString()}</span></p>
                                    <button
                                        onClick={() => handleEdit(withdrawal)} // زر التحديث
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg py-1 px-3 mr-2"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWithdrawal(withdrawal.withdrawalId)}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-1 px-3"
                                    >
                                        Delete Withdrawal
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default WorkerWithdrawalsPage;
