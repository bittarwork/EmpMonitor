// WithdrawalFormPopup.js
import React from 'react';

const WithdrawalFormPopup = ({
    isOpen,
    onClose,
    onSubmit,
    newWithdrawal,
    handleChange,
    employees,
    materials,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-2">
                    {newWithdrawal.employee ? 'Update Withdrawal' : 'Add New Withdrawal'}
                </h2>
                <form onSubmit={onSubmit} className="space-y-4">
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
                            {employees.map((employee) => (
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
                            {materials.map((material) => (
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
                    <div className="flex justify-between">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg py-2 px-4">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4">
                            {newWithdrawal.employee ? 'Update Withdrawal' : 'Add Withdrawal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawalFormPopup;
