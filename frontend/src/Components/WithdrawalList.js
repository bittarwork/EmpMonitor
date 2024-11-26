import React from 'react';

const WithdrawalList = ({ withdrawals, onEdit, onDelete }) => {
    return (
        <div className="space-y-6">
            {withdrawals.length === 0 ? (
                <p className="text-center text-gray-500">لا توجد سحوبات مسجلة لهذا الموظف.</p>
            ) : (
                withdrawals.map((withdrawal) => (
                    <div
                        key={withdrawal.withdrawalId}
                        className="border p-6 rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-shadow duration-300"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {withdrawal.materialName}
                        </h3>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">الكمية:</span> {withdrawal.quantity}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">الملاحظات:</span> {withdrawal.note || 'لا توجد ملاحظات'}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">التاريخ:</span> {new Date(withdrawal.date).toLocaleString('ar-EG')}
                        </p>
                        <div className="mt-6 flex space-x-4 justify-center">
                            <button
                                onClick={() => onEdit(withdrawal)}
                                className="bg-blue-500 hover:bg-blue-600 mx-5 text-white rounded-lg py-2 px-4 transition duration-200"
                            >
                                تعديل
                            </button>
                            <button
                                onClick={() => onDelete(withdrawal.withdrawalId)}
                                className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 transition duration-200"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default WithdrawalList;
