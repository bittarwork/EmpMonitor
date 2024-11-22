import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WithdrawalFormPopup from '../models/WithdrawalFormPopup';
import WithdrawalList from '../Components/WithdrawalList';

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
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
                setError('خطأ في تحميل البيانات');
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
        setIsPopupOpen(true);
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

    const resetForm = () => {
        setNewWithdrawal({ employee: '', material: '', quantity: 1, note: '' });
        setSelectedWithdrawal(null);
        setIsPopupOpen(false);
    };

    const handleDeleteWithdrawal = async (withdrawalId) => {
        if (!withdrawalId) {
            console.error("Invalid withdrawal ID");
            return;
        }

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/withdrawals/${withdrawalId}`);
            setSuccessMessage('تم حذف السحب بنجاح');
            setError(null);
            setWithdrawals((prev) =>
                prev.map(employeeWithdrawals => ({
                    ...employeeWithdrawals,
                    withdrawals: employeeWithdrawals.withdrawals.filter(w => w.withdrawalId !== withdrawalId)
                }))
            );
        } catch (err) {
            setError('خطأ في حذف السحب');
        }
    };

    const handleDeleteAllWithdrawals = async (employeeId) => {
        if (!employeeId) {
            console.error("Invalid employee ID");
            return;
        }

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/withdrawals/employee/${employeeId}`);
            setSuccessMessage('تم حذف جميع السحوبات لهذا الموظف');
            setError(null);
            setWithdrawals((prev) => prev.filter((ew) => ew.employeeId !== employeeId));
        } catch (err) {
            setError('خطأ في حذف جميع السحوبات');
        }
    };

    const getEmployeeName = (id) => {
        const employee = employees.find(emp => emp.id === id);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'موظف غير معروف';
    };


    const filteredWithdrawals = withdrawals.filter((employeeWithdrawals) =>
        getEmployeeName(employeeWithdrawals.employeeId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center text-lg">جاري التحميل...</div>;

    return (
        <div className="min-w-full mx-auto p-6 " dir="rtl">
            <h1 className="text-2xl font-bold mb-4 text-center">السحوبات</h1>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>}

            <div className="flex items-center gap-x-2 mb-4">
                <input
                    type="text"
                    placeholder="البحث حسب الاسم"
                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-2/3 ml-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                >
                    إضافة سحب جديد
                </button>
            </div>

            <WithdrawalFormPopup
                isOpen={isPopupOpen}
                onClose={resetForm}
                onSubmit={handleSubmit}
                newWithdrawal={newWithdrawal}
                handleChange={handleChange}
                employees={employees}
                materials={materials}
            />

            {filteredWithdrawals.length === 0 ? (
                <p className="text-center">لا توجد سحوبات لهذا الموظف.</p>
            ) : (
                filteredWithdrawals.map((employeeWithdrawals) => (
                    <div key={employeeWithdrawals.employeeId} className="border p-4 mb-4 rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-2">الموظف: {getEmployeeName(employeeWithdrawals.employeeId)}</h2>
                        <img></img>
                        <button
                            onClick={() => handleDeleteAllWithdrawals(employeeWithdrawals.employeeId)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-1 px-3 mb-3"
                        >
                            حذف جميع السحوبات لهذا الموظف
                        </button>
                        <WithdrawalList
                            withdrawals={employeeWithdrawals.withdrawals}
                            onEdit={handleEdit}
                            onDelete={handleDeleteWithdrawal}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default WorkerWithdrawalsPage;
