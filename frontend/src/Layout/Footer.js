import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p className="mb-2">جميع الحقوق محفوظة © {new Date().getFullYear()} شركة RQT.</p>
                <div className="flex justify-center mt-4 space-x-4">
                    <a
                        href="https://www.rqt.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline"
                    >
                        زيارة موقعنا
                    </a>
                    <span className="text-gray-400">|</span>
                    <a
                        href="https://www.rqt.com/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline"
                    >
                        اتصل بنا
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
