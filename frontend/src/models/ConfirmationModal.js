import React from 'react';

const ConfirmationModal = ({ visible, onConfirm, onCancel }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 h-auto relative flex flex-col items-center">

                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
                    title="إغلاق"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    تأكيد الحذف
                </h2>

                <p className="mb-4 text-center text-gray-700">
                    هل أنت متأكد أنك ترغب في حذف هذه المادة؟
                </p>

                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 mx-2 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-md"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
                    >
                        حذف
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
