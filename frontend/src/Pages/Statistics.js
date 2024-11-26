import React from 'react';
import EmployeeStatistics from '../Components/EmployeeStatistics';
import MaterialStatistics from '../Components/MaterialStatistics';
import SalaryStatistics from '../Components/SalaryStatistics';
const Statistics = () => {
    return (
        <div className='overflow-auto w-full'>
            <EmployeeStatistics></EmployeeStatistics>
            <MaterialStatistics></MaterialStatistics>
            <SalaryStatistics></SalaryStatistics>
        </div>
    );
};

export default Statistics;