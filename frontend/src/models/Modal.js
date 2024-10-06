import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
