import React, { useState } from 'react';
import axios from 'axios';

const FileUploadModal = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [addedRecordsCount, setAddedRecordsCount] = useState(0);

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('يرجى اختيار ملف.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/attendance/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Handle server response
            if (response.data.message === "Attendance records processed successfully") {
                setMessage('تم رفع الملف بنجاح.');
                setAddedRecordsCount(response.data.addedRecordsCount);
                // Close the modal after successful upload
                setTimeout(() => {
                    onClose(); // Close the modal after 2 seconds
                }, 2000);
            } else {
                setMessage('هناك مشكلة في رفع الملف.');
            }
        } catch (error) {
            setMessage('حدث خطأ أثناء رفع الملف.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-100 p-6 rounded-md shadow-md w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">رفع ملف الحضور</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors duration-300"
                    >
                        &times; {/* رمز إغلاق النافذة */}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">اختيار الملف:</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                            required
                        />
                    </div>

                    {/* عرض الرسالة إذا وُجدت */}
                    {message && <p className="text-gray-700 mb-2">{message}</p>}
                    {addedRecordsCount > 0 && <p className="text-gray-700">تم إضافة {addedRecordsCount} سجلات.</p>}

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2 text-gray-800"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 text-white rounded"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جارٍ رفع الملف...' : 'رفع الملف'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FileUploadModal;
