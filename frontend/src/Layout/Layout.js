import React, { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Layout = ({ children }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="flex flex-col h-screen font-tajawal">
            {/* Header */}
            <Header />

            <div className="flex flex-grow">
                {/* Sidebar */}
                {user ? (
                    <Sidebar />
                ) : (
                    <div className="w-64 p-4 bg-gray-800 flex items-center justify-center">
                        <h1 className="text-white text-2xl">Logo</h1>
                    </div>
                )}

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
