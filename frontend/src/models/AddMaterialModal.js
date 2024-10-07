// src/components/AddMaterialModal.js
import React, { useState } from 'react';

const AddMaterialModal = ({ onClose, handleAddMaterial }) => {
    const [materialData, setMaterialData] = useState({
        name: '',
        price: '',
        quantity: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddMaterial(materialData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">إضافة مادة جديدة</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 p-2 rounded-full">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">اسم المادة:</label>
                        <input
                            type="text"
                            value={materialData.name}
                            onChange={(e) => setMaterialData({ ...materialData, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">السعر:</label>
                        <input
                            type="number"
                            value={materialData.price}
                            onChange={(e) => setMaterialData({ ...materialData, price: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">الكمية:</label>
                        <input
                            type="number"
                            value={materialData.quantity}
                            onChange={(e) => setMaterialData({ ...materialData, quantity: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">
                            إلغاء
                        </button>
                        <button type="submit" className="bg-blue-500 px-4 py-2 text-white rounded">
                            إضافة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaterialModal;
