import React, { useState, useEffect } from 'react';
import { useMaterialContext } from '../Context/MaterialContext';
import AddMaterialModal from '../models/AddMaterialModal';
import EditMaterialModal from '../models/EditMaterialModal';
import DeleteMaterialModal from '../models/DeleteMaterialModal';

const MaterialsPage = () => {
    const { state, addMaterial, updateMaterial, deleteMaterial, fetchMaterials } = useMaterialContext();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [materialData, setMaterialData] = useState({ name: '', price: '', quantity: '' });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    // تصفية المواد بناءً على استعلام البحث
    const filteredMaterials = state.materials.filter((material) =>
        material.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openEditPopup = (material) => {
        setMaterialData({ name: material.name, price: material.price, quantity: material.quantity });
        setSelectedMaterial(material);
        setIsEditOpen(true);
    };

    const openDeletePopup = (material) => {
        setSelectedMaterial(material);
        setIsDeleteOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl text-center font-semibold mb-4">إدارة المواد</h1>

            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="بحث عن مادة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    إضافة مادة جديدة
                </button>
            </div>

            <table className="min-w-full bg-white rounded-md shadow-md overflow-hidden">
                <thead className="bg-blue-300">
                    <tr>
                        <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">اسم المادة</th>
                        <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">السعر</th>
                        <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">الكمية</th>
                        <th className="border-b px-4 py-4 text-left text-gray-600 sticky top-0 bg-blue-300 z-10">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMaterials.length > 0 ? (
                        filteredMaterials.map((material) => (
                            <tr key={material._id} className="hover:bg-blue-100 transition duration-200">
                                <td className="border-b px-4 py-4 text-gray-700">{material.name}</td>
                                <td className="border-b px-4 py-4 text-gray-700">{material.price}</td>
                                <td className="border-b px-4 py-4 text-gray-700">{material.quantity}</td>
                                <td className="border-b px-4 py-4 text-gray-700">
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition duration-300"
                                        onClick={() => openEditPopup(material)}
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                                        onClick={() => openDeletePopup(material)}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center border-b px-4 py-4 text-gray-700">لا توجد مواد مطابقة للبحث.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* نوافذ منبثقة لإضافة، تعديل وحذف المواد */}
            {isAddOpen && (
                <AddMaterialModal
                    onClose={() => setIsAddOpen(false)}
                    handleAddMaterial={(material) => {
                        addMaterial(material);
                        setIsAddOpen(false);
                    }}
                />
            )}

            {isEditOpen && (
                <EditMaterialModal
                    onClose={() => setIsEditOpen(false)}
                    materialData={materialData}
                    setMaterialData={setMaterialData}
                    handleEditMaterial={() => {
                        updateMaterial(selectedMaterial._id, materialData);
                        setIsEditOpen(false);
                    }}
                />
            )}

            {isDeleteOpen && (
                <DeleteMaterialModal
                    onClose={() => setIsDeleteOpen(false)}
                    selectedMaterial={selectedMaterial}
                    handleDeleteMaterial={() => {
                        deleteMaterial(selectedMaterial._id);
                        setIsDeleteOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default MaterialsPage;
