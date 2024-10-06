import React from 'react';

const EmployeeCard = ({ employee, onViewMore, onEdit, onDelete }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-4 flex flex-col">
            <img src={employee.image} alt={`${employee.firstName} ${employee.lastName}`} className="w-full h-32 object-cover rounded-t-lg" />
            <h2 className="text-lg font-semibold mt-2">{`${employee.firstName} ${employee.lastName}`}</h2>
            <p className="text-gray-600">Hourly Rate: ${employee.hourlyRate}</p>
            <p className="text-gray-500">Contract Period: {new Date(employee.contractStartDate).toLocaleDateString()} to {new Date(employee.contractEndDate).toLocaleDateString()}</p>
            <div className="mt-4">
                <button onClick={() => onViewMore(employee.id)} className="bg-blue-500 text-white rounded px-4 py-2 mr-2">View More</button>
                <button onClick={() => onEdit(employee.id)} className="bg-yellow-500 text-white rounded px-4 py-2 mr-2">Edit</button>
                <button onClick={() => onDelete(employee.id)} className="bg-red-500 text-white rounded px-4 py-2">Delete</button>
            </div>
        </div>
    );
};

export default EmployeeCard;
