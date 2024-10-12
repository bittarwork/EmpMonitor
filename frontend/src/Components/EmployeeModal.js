import React from 'react';

const EmployeeModal = ({ isOpen, onRequestClose, employee, onSubmit }) => {
    const [employeeData, setEmployeeData] = React.useState({
        firstName: '',
        lastName: '',
        fingerprint: '',
        contractStartDate: '',
        contractEndDate: '',
        hourlyRate: '',
        image: null,
    });

    React.useEffect(() => {
        if (employee) {
            setEmployeeData(employee);
        } else {
            setEmployeeData({
                firstName: '',
                lastName: '',
                fingerprint: '',
                contractStartDate: '',
                contractEndDate: '',
                hourlyRate: '',
                image: null,
            });
        }
    }, [employee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        setEmployeeData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(employeeData);
        onRequestClose();
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{employee ? 'تعديل موظف' : 'إضافة موظف'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">الاسم الأول:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={employeeData.firstName}
                            onChange={handleInputChange}
                            required
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">اسم العائلة:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={employeeData.lastName}
                            onChange={handleInputChange}
                            required
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">البصمة:</label>
                        <input
                            type="text"
                            name="fingerprint"
                            value={employeeData.fingerprint}
                            onChange={handleInputChange}
                            required
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">تاريخ بدء العقد:</label>
                        <input
                            type="date"
                            name="contractStartDate"
                            value={employeeData.contractStartDate}
                            onChange={handleInputChange}
                            required
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">تاريخ انتهاء العقد:</label>
                        <input
                            type="date"
                            name="contractEndDate"
                            value={employeeData.contractEndDate}
                            onChange={handleInputChange}
                            required
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">الأجر بالساعة:</label>
                        <input
                            type="number"
                            name="hourlyRate"
                            value={employeeData.hourlyRate}
                            onChange={handleInputChange}
                            required
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">صورة:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onRequestClose}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-2"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md"
                        >
                            {employee ? 'تحديث' : 'إضافة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
