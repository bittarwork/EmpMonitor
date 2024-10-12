import React from 'react';

const Home = () => {
    return (
        <div className="container mx-auto p-6  mt-10" dir='rtl'>
            <h1 className="text-3xl font-bold text-center text-blue-600">مرحباً بكم في برنامج إدارة الموظفين</h1>
            <p className="mt-4 text-gray-700 text-center">
                هذا البرنامج تم تصميمه من قبل شركة <strong>RQT</strong> للحلول البرمجية،
                لتلبية احتياجات معمل البسكوت في إدارة جميع جوانب العمل المتعلقة بالموظفين.
            </p>
            <p className="mt-4 text-gray-700 text-center">
                يوفر البرنامج ميزات متقدمة تشمل:
            </p>
            <ul className="list-disc list-inside mt-4 mx-auto max-w-md">
                <li>تسجيل دخول وخروج الموظفين بشكل دقيق.</li>
                <li>إدارة الرواتب والمستحقات بكل سهولة.</li>
                <li>تتبع المسحوبات من المخزون والمواد المستخدمة في الإنتاج.</li>
                <li>إصدار تقارير مفصلة حول الأداء والمبيعات.</li>
                <li>إدارة الشهادات والتدريب للموظفين.</li>
            </ul>
            <p className="mt-4 text-gray-700 text-center">
                نأمل أن تجدوا البرنامج مفيدًا وملائمًا لاحتياجاتكم.
                يُرجى تسجيل الدخول أو التسجيل للبدء في استخدام التطبيق.
            </p>
            <p className="mt-4 font-bold text-center text-gray-700">
                شكرًا لاختياركم شركة RQT، ونتطلع لخدمتكم بأفضل طريقة ممكنة!
            </p>

            {/* Buttons Section */}
            <div className="flex justify-center mt-6 space-x-4">
                <a
                    href="https://www.rqt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 mx-2 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    زيارة موقع شركة RQT
                </a>
                <a
                    href="https://www.rqt.com/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                >
                    تعرف على المزيد
                </a>
            </div>
        </div>
    );
};

export default Home;
