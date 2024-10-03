import React, { useContext } from 'react';
import { UserContext } from '../Context/UserContext';

const LogoutModal = ({ onConfirm, onCancel }) => {
    const { loading } = useContext(UserContext);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
                <p>Are you sure you want to logout?</p>
                <div className="flex justify-end mt-4">
                    <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded mr-2">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-500 px-4 py-2 text-white rounded" disabled={loading}>
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
