import React from 'react';

const Popup = ({ visible, onClose, material, onSubmit, onChange }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" dir="rtl">
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4">
                    {material ? 'تعديل المادة' : 'إضافة مادة جديدة'}
                </h2>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="اسم المادة"
                        value={material?.name || ''}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="border p-2 rounded mb-2 w-full"
                        required
                    />
                    <input
                        type="number"
                        placeholder="السعر"
                        value={material?.price || ''}
                        onChange={(e) => onChange('price', Number(e.target.value))}
                        className="border p-2 rounded mb-2 w-full"
                        required
                    />
                    <input
                        type="number"
                        placeholder="الكمية"
                        value={material?.quantity || ''}
                        onChange={(e) => onChange('quantity', Number(e.target.value))}
                        className="border p-2 rounded mb-2 w-full"
                        required
                    />
                    <div className="flex justify-end gap-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
                            إلغاء
                        </button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                            {material ? 'حفظ التعديلات' : 'إضافة المادة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Popup;
