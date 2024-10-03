import React, { useContext } from 'react';
import { UserContext } from '../Context/UserContext';

const Dashboard = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
            <p>Hello, {user?.name}! Here are your details:</p>
            <ul>
                <li>ID: {user?.id}</li>
                <li>Email: {user?.email}</li>
            </ul>
        </div>
    );
};

export default Dashboard;
