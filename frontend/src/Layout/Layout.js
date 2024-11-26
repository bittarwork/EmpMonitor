import React, { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import logo from '../assets/images/logo.png'; // استيراد الصورة من المسار المحدد

const Layout = ({ children }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="flex flex-col h-screen font-tajawal">
            {/* Header */}
            <Header />

            <div className="flex flex-grow">
                {/* Conditionally render Sidebar */}
                {user ? (
                    // If user exists, show Sidebar
                    <Sidebar />
                ) : ""}

                {/* Main Content */}
                <main className="p-6 flex-grow">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
