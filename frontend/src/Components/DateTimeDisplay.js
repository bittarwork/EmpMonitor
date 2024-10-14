// src/Components/DateTimeDisplay.js
import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa'; // استخدام أيقونة ساعة

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
        <div className="flex items-center text-white">
            <FaClock className="text-2xl text-yellow-500 mr-2" /> {/* أيقونة الساعة بلون أصفر */}
            <div className="flex flex-col text-right">
                <h2 className="text-lg font-bold">{formatTime(currentDateTime)}</h2>
                <span className="text-sm">{formatDate(currentDateTime)}</span>
            </div>
        </div>
    );
};

export default DateTimeDisplay;
