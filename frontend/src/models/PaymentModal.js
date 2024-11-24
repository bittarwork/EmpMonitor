import React, { useState } from "react";

const PaymentModal = ({ isOpen, onClose, onSubmit, salaryId }) => {
    const [paidAmount, setPaidAmount] = useState("");

    const handleSubmit = () => {
        if (!paidAmount || isNaN(paidAmount) || paidAmount <= 0) {
            alert("يرجى إدخال مبلغ صحيح.");
            return;
        }
        onSubmit({ salaryId, paidAmount: Number(paidAmount) });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 space-y-4 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700">إضافة دفعة</h2>
                <div>
                    <label className="block text-sm text-gray-600 mb-2">المبلغ المدفوع:</label>
                    <input
                        type="number"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        placeholder="أدخل المبلغ"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        إغلاق
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        إرسال
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
