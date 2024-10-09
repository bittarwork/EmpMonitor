// src/Components/EmployeeWithdrawals.js

import React from 'react';

const EmployeeWithdrawals = ({ employee, withdrawals }) => {
    return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-lg mb-6 bg-white">
            <div className="flex items-center mb-4">
                <img src={employee.image} alt={`${employee.firstName} ${employee.lastName}`} className="w-16 h-16 rounded-full border-2 border-blue-500 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{`${employee.firstName} ${employee.lastName}`}</h2>
                    <p className="text-sm text-gray-600">Contract: {new Date(employee.contractStartDate).toLocaleDateString()} - {new Date(employee.contractEndDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Hourly Rate: {employee.hourlyRate} SYP</p>
                </div>
            </div>
            {withdrawals.length === 0 ? (
                <p className="text-gray-500">No withdrawals found for this employee.</p>
            ) : (
                <ul>
                    {withdrawals.map((withdrawal) => (
                        <li key={withdrawal._id} className="border-b border-gray-200 py-2 last:border-b-0">
                            <p><strong>Material:</strong> {withdrawal.materialName}</p>
                            <p><strong>Quantity:</strong> {withdrawal.quantity}</p>
                            <p><strong>Note:</strong> {withdrawal.note}</p>
                            <p><strong>Date:</strong> {new Date(withdrawal.date).toLocaleDateString()} at {new Date(withdrawal.date).toLocaleTimeString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmployeeWithdrawals;
