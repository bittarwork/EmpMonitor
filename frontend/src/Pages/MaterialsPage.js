import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Popup from '../models/PopupMaterial';
import ConfirmationModal from '../models/ConfirmationModal';

const MaterialsPage = () => {
    const [materials, setMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState({ name: '', price: '', quantity: '' });
    const [editMaterial, setEditMaterial] = useState(null);
    const [materialToDelete, setMaterialToDelete] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL + '/materials';

    const fetchMaterials = useCallback(async () => {
        try {
            const response = await axios.get(API_URL);
            setMaterials(response.data);
        } catch (err) {
            console.error('حدث خطأ أثناء جلب المواد:', err);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const handleAddClick = () => {
        setCurrentMaterial({ name: '', price: '', quantity: '' });
        setEditMaterial(null);
        setPopupVisible(true);
    };

    const handleEditClick = (material) => {
        setCurrentMaterial(material);
        setEditMaterial(material._id);
        setPopupVisible(true);
    };

    const handleDeleteClick = (id) => {
        setMaterialToDelete(id);
        setConfirmationVisible(true);
    };

    const handlePopupSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMaterial) {
                const response = await axios.put(`${API_URL}/${editMaterial}`, currentMaterial);
                setMaterials(materials.map((material) => (material._id === editMaterial ? response.data.material : material)));
            } else {
                const response = await axios.post(API_URL, currentMaterial);
                setMaterials([...materials, response.data.material]);
            }
            setPopupVisible(false);
        } catch (err) {
            console.error('حدث خطأ أثناء حفظ المادة:', err);
        }
    };

    const handleConfirmationConfirm = async () => {
        try {
            await axios.delete(`${API_URL}/${materialToDelete}`);
            setMaterials(materials.filter((material) => material._id !== materialToDelete));
            setConfirmationVisible(false);
        } catch (err) {
            console.error('حدث خطأ أثناء حذف المادة:', err);
        }
    };

    const filteredMaterials = materials.filter((material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen min-w-full" dir="rtl">
            <h1 className="text-4xl font-bold mb-8 text-center">إدارة المواد</h1>
            <div className="flex items-center gap-x-2 mb-4">
                <button
                    onClick={handleAddClick}
                    className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                >
                    إضافة مادة
                </button>
                <input
                    type="text"
                    placeholder="بحث عن المواد..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-2/3 ml-2"
                />
            </div>
            <div className="overflow-x-auto flex-grow" style={{ maxHeight: '450px' }}>
                <table className="w-full bg-white rounded-md shadow-md">
                    <thead className="bg-blue-500">
                        <tr>
                            <th className="border-b font-bold px-6 py-4 text-right text-white ">اسم المادة</th>
                            <th className="border-b px-6 py-4 text-right text-white font-bold">السعر</th>
                            <th className="border-b px-6 py-4 text-right text-white font-bold">الكمية</th>
                            <th className="border-b px-6 py-4 text-right text-white font-bold">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMaterials.map((material) => (
                            <tr key={material._id} className="hover:bg-blue-100 transition duration-200">
                                <td className="border-b px-6 py-4 font-semibold">{material.name}</td>
                                <td className="border-b px-6 py-4">${material.price}</td>
                                <td className="border-b px-6 py-4">{material.quantity}</td>
                                <td className="border-b px-6 py-4">
                                    <button
                                        onClick={() => handleEditClick(material)}
                                        className="bg-yellow-500 ml-2 text-white p-2 rounded mr-2 shadow hover:bg-yellow-600"
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(material._id)}
                                        className="bg-red-500 text-white p-2 rounded shadow hover:bg-red-600"
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Popup
                visible={popupVisible}
                onClose={() => setPopupVisible(false)}
                material={currentMaterial}
                onSubmit={handlePopupSubmit}
                onChange={(field, value) => setCurrentMaterial({ ...currentMaterial, [field]: value })}
            />
            <ConfirmationModal
                visible={confirmationVisible}
                onConfirm={handleConfirmationConfirm}
                onCancel={() => setConfirmationVisible(false)}
            />
        </div>
    );
};

export default MaterialsPage;
