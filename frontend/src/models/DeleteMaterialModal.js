// src/components/DeleteMaterialModal.js
import React from 'react';

const DeleteMaterialModal = ({ onClose, selectedMaterial, handleDeleteMaterial }) => {
    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">تأكيد الحذف</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 p-2 rounded-full">
                        &times;
                    </button>
                </div>
                <p className="mb-4">هل أنت متأكد من حذف المادة "{selectedMaterial?.name}"؟</p>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">
                        إلغاء
                    </button>
                    <button onClick={handleDeleteMaterial} className="bg-red-500 px-4 py-2 text-white rounded">
                        نعم، احذف
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteMaterialModal;
