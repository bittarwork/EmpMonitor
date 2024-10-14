// WithdrawalList.js
import React from 'react';

// WithdrawalList.js
const WithdrawalList = ({ withdrawals, onEdit, onDelete }) => {
    return (
        <div className="space-y-4">
            {withdrawals.length === 0 ? (
                <p className="text-center text-gray-500">No withdrawals found for this employee.</p>
            ) : (
                withdrawals.map((withdrawal) => (
                    <div key={withdrawal.withdrawalId} className="border p-4 rounded-lg shadow-md bg-white">
                        <h3 className="text-lg font-semibold mb-2">{withdrawal.materialName}</h3>
                        <p className="text-gray-600">Quantity: <span className="font-medium">{withdrawal.quantity}</span></p>
                        <p className="text-gray-600">Note: <span className="font-medium">{withdrawal.note}</span></p>
                        <p className="text-gray-600">Date: <span className="font-medium">{new Date(withdrawal.date).toLocaleString()}</span></p>
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={() => onEdit(withdrawal)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg py-1 px-3 transition duration-200"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => onDelete(withdrawal.withdrawalId)} // تأكد من تمرير withdrawalId
                                className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-1 px-3 transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};


export default WithdrawalList;
