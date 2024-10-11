import React from 'react';

const ConfirmationModal = ({ visible, onConfirm, onCancel }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-4">Are you sure you want to delete this material?</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onCancel} className="bg-gray-500 text-white p-2 rounded">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-500 text-white p-2 rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
