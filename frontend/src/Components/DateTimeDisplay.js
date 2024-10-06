// src/Components/DateTimeDisplay.js
import React, { useEffect, useState } from 'react';

const DateTimeDisplay = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ar-EG', options);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{formatTime(currentDateTime)}</h2>
            <span className="text-gray-600">{formatDate(currentDateTime)}</span>
        </div>
    );
};

export default DateTimeDisplay;
