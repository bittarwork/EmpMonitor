const cron = require('node-cron');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Salary = require('../models/Salary');
const Withdrawal = require('../models/Withdrawal');

// Cron Job that runs every day at midnight
const calculateSalaries = () => {
    cron.schedule('*/5 * * * * *', async () => {
        try {
            console.log('Cron job started at:', new Date());

            // Fetch all employees and populate withdrawals
            console.log('Fetching all employees from the database...');
            const employees = await Employee.find().populate('withdrawals').exec();
            console.log(`Found ${employees.length} employees.`);

            // Process each employee
            for (const employee of employees) {
                console.log(`Processing salary for employee: ${employee.firstName} ${employee.lastName}`);
                const { hourlyRate, contractStartDate, contractEndDate, withdrawals, mockAttendances } = employee;

                // Calculate total worked hours
                let totalWorkedHours = 0;
                mockAttendances.forEach(attendance => {
                    const checkTime = new Date(attendance.checkTime);
                    if (isNaN(checkTime.getTime())) {
                        console.warn(`Invalid checkTime for employee ${employee.firstName} ${employee.lastName}:`, attendance.checkTime);
                    } else {
                        // Assuming each checkTime is the "clock-in" time, we need a "clock-out" time (if available)
                        const workedHours = checkTime.getHours() + checkTime.getMinutes() / 60;
                        console.log(`Worked hours for ${employee.firstName} ${employee.lastName}: ${workedHours}`);
                        totalWorkedHours += workedHours;
                    }
                });

                console.log(`Total worked hours for ${employee.firstName} ${employee.lastName}: ${totalWorkedHours}`);

                // Calculate total salary based on worked hours and hourly rate
                const totalSalary = totalWorkedHours * hourlyRate;
                console.log(`Total salary for ${employee.firstName} ${employee.lastName}: ${totalSalary}`);

                // Calculate total withdrawals
                let totalWithdrawals = 0;
                withdrawals.forEach(withdrawal => {
                    const materialPrice = withdrawal.material.price || 0;  // Get price from material reference
                    totalWithdrawals += withdrawal.quantity * materialPrice;  // Multiply quantity by material price
                });
                console.log(`Total withdrawals for ${employee.firstName} ${employee.lastName}: ${totalWithdrawals}`);

                // Final salary calculation
                const finalSalary = totalSalary - totalWithdrawals;
                console.log(`Final salary after withdrawals for ${employee.firstName} ${employee.lastName}: ${finalSalary}`);

                // Create new salary entry
                const newSalary = new Salary({
                    employee: employee._id,
                    startDate: contractStartDate,
                    endDate: contractEndDate,
                    totalWorkedHours: totalWorkedHours,
                    hourlyRate: hourlyRate,
                    totalSalary: totalSalary,
                    totalWithdrawals: totalWithdrawals,
                    finalSalary: finalSalary,
                    withdrawals: withdrawals.map(w => w._id),
                    salaryDate: new Date(),
                    salarySettled: false,
                });

                // Save the new salary document
                await newSalary.save();
                console.log(`Salary calculated and saved for employee: ${employee.firstName} ${employee.lastName}`);
            }
        } catch (error) {
            console.error('Error during salary calculation:', error);
        }
    });
};

// Export the function
module.exports = { calculateSalaries };
