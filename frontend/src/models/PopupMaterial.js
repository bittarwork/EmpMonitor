import React from 'react';

const Popup = ({ visible, onClose, material, onSubmit, onChange }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 h-auto relative flex flex-col items-center">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
                    title="Close"
                >
                    ✕
                </button>

                {/* Conditionally render title based on whether we are editing or adding a material */}
                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    {material?.name ? 'تعديل المادة' : 'إضافة مادة جديدة'}
                </h2>

                <form onSubmit={onSubmit} className="w-full space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">اسم المادة</label>
                        <input
                            type="text"
                            placeholder="اسم المادة"
                            value={material?.name || ''}
                            onChange={(e) => onChange('name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">السعر</label>
                        <input
                            type="number"
                            placeholder="السعر"
                            value={material?.price || ''}
                            onChange={(e) => onChange('price', Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">الكمية</label>
                        <input
                            type="number"
                            placeholder="الكمية"
                            value={material?.quantity || ''}
                            onChange={(e) => onChange('quantity', Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>

                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 mx-2 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-md"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
                        >
                            {/* Conditionally render button text based on whether we are editing or adding a material */}
                            {material?.name ? 'حفظ التعديلات' : 'إضافة المادة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Popup;
