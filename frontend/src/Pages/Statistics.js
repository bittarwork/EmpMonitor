import React from 'react';
import EmployeeStatistics from '../Components/EmployeeStatistics';
import MaterialStatistics from '../Components/MaterialStatistics';
const Statistics = () => {
    return (
        <div className='overflow-auto w-full'>
            <EmployeeStatistics></EmployeeStatistics>
            <MaterialStatistics></MaterialStatistics>
        </div>
    );
};

export default Statistics;