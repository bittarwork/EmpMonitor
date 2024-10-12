import React from 'react';

const EmployeeModal = ({ isOpen, onRequestClose, employeeData, onInputChange, onImageChange, onSubmit, isEditing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 max-h-[80vh] overflow-y-auto relative">
                <button onClick={onRequestClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">{isEditing ? 'تعديل موظف' : 'إضافة موظف جديد'}</h2>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            name="firstName"
                            value={employeeData.firstName}
                            onChange={onInputChange}
                            placeholder="الاسم الأول"
                            required
                            className="border border-gray-300 p-3 rounded-md w-full"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={employeeData.lastName}
                            onChange={onInputChange}
                            placeholder="اسم العائلة"
                            required
                            className="border border-gray-300 p-3 rounded-md w-full"
                        />
                        <input
                            type="text"
                            name="fingerprint"
                            value={employeeData.fingerprint}
                            onChange={onInputChange}
                            placeholder="البصمة"
                            required
                            className="border border-gray-300 p-3 rounded-md w-full"
                        />
                        <input
                            type="date"
                            name="contractStartDate"
                            value={employeeData.contractStartDate}
                            onChange={onInputChange}
                            required
                            className="border border-gray-300 p-3 rounded-md w-full"
                        />
                        <input
                            type="date"
                            name="contractEndDate"
                            value={employeeData.contractEndDate}
                            onChange={onInputChange}
                            required
                            className="border border-gray-300 p-3 rounded-md w-full"
                        />
                        <input
                            type="number"
                            name="hourlyRate"
                            value={employeeData.hourlyRate}
                            onChange={onInputChange}
                            placeholder="الأجر بالساعة"
                            required
                            className="border border-gray-300 p-3 rounded-md w-full"
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={onImageChange}
                            className="border border-gray-300 p-3 rounded-md w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition duration-300 w-full mt-4"
                    >
                        {isEditing ? 'تحديث الموظف' : 'إضافة الموظف'}
                    </button>
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="bg-gray-300 text-gray-800 px-5 py-3 rounded-md hover:bg-gray-400 transition duration-300 w-full mt-2"
                    >
                        إغلاق
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
