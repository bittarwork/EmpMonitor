import React from 'react';

const Home = () => {
    return (
        <div className="container mx-auto p-6 mt-10" dir="rtl">
            {/* Heading */}
            <h1 className="text-3xl font-bold text-center text-blue-600">
                مرحباً بكم في برنامج إدارة الموظفين
            </h1>

            {/* Paragraph */}
            <p className="mt-4 text-gray-700 text-center">
                هذا البرنامج تم تصميمه من قبل شركة <strong>RQT</strong> للحلول البرمجية،
                لتلبية احتياجات معمل البسكوت في إدارة جميع جوانب العمل المتعلقة بالموظفين.
            </p>

            {/* Buttons Section */}
            <div className="flex justify-center mt-6">
                <a
                    href="https://www.rqt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-6 py-3 mx-5 rounded-md hover:bg-blue-600 transition duration-300 text-center"
                >
                    زيارة موقع شركة RQT
                </a>
                <a
                    href="https://www.rqt.com/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-500 text-white px-6 py-3 mx-5 rounded-md hover:bg-gray-600 transition duration-300 text-center"
                >
                    تعرف على المزيد
                </a>
            </div>
        </div>
    );
};

export default Home;
