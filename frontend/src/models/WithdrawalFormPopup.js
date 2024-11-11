import React from 'react';

const WithdrawalFormPopup = ({
    isOpen,
    onClose,
    onSubmit,
    newWithdrawal,
    handleChange,
    employees,
    materials,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 h-auto relative flex flex-col items-center">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
                    title="Close"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    {newWithdrawal.employee ? 'تحديث المسحوبات' : 'إضافة مسحوبات جديدة'}
                </h2>

                <form onSubmit={onSubmit} className="w-full space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">الموظف</label>
                        <select
                            name="employee"
                            value={newWithdrawal.employee}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            <option value="" disabled>اختر موظفًا</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {`${employee.firstName} ${employee.lastName}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">المادة</label>
                        <select
                            name="material"
                            value={newWithdrawal.material}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            <option value="" disabled>اختر المادة</option>
                            {materials.map((material) => (
                                <option key={material._id} value={material._id}>
                                    {material.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">الكمية</label>
                        <input
                            type="number"
                            name="quantity"
                            value={newWithdrawal.quantity}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">ملاحظات</label>
                        <textarea
                            name="note"
                            value={newWithdrawal.note}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-md"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
                        >
                            {newWithdrawal.employee ? 'تحديث المسحوبات' : 'إضافة المسحوبات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawalFormPopup;
