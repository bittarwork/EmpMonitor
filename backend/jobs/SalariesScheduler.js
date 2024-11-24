const cron = require('node-cron');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Material = require('../models/Material');
const Withdrawal = require('../models/Withdrawal');
const Salary = require('../models/Salary');

// Function to calculate worked hours from attendance records
const calculateWorkedHours = (attendances) => {
    let totalWorkedHours = 0;

    for (let i = 0; i < attendances.length; i += 2) {
        const entry = attendances[i];
        const exit = attendances[i + 1];
        if (entry && exit) {
            const workedTime = (new Date(exit.checkTime) - new Date(entry.checkTime)) / 3600000; // Time in hours
            totalWorkedHours += workedTime;
        }
    }
    return totalWorkedHours;
};

// Function to calculate total withdrawals for an employee
const calculateWithdrawals = async (employeeId) => {
    const withdrawals = await Withdrawal.find({ employee: employeeId }).populate('material');
    let totalWithdrawals = 0;

    withdrawals.forEach((withdrawal) => {
        const withdrawalCost = withdrawal.quantity * withdrawal.material.price;
        totalWithdrawals += withdrawalCost;
    });
    return { totalWithdrawals, withdrawals };
};

// Function to calculate and store salaries for all employees
const calculateSalaries = async () => {
    try {
        // Fetch all employees
        const employees = await Employee.find().populate('mockAttendances');

        for (let employee of employees) {
            // Check if salary has already been calculated for this period
            const existingSalary = await Salary.findOne({ employee: employee._id, salaryDate: { $gte: new Date().setDate(1) } }); // Check if salary already exists for this month

            // If salary exists, update it, otherwise calculate and create a new one
            if (existingSalary) {
                console.log(`Salary for employee ${employee._id} already calculated. Updating salary...`);

                // Get employee's hourly rate and worked attendances
                const hourlyRate = employee.hourlyRate;
                const attendances = await Attendance.find({ employee: employee._id }).sort({ checkTime: 1 });

                // Calculate total worked hours
                const workedHours = calculateWorkedHours(attendances);

                // Calculate total withdrawals and get withdrawal details
                const { totalWithdrawals, withdrawals } = await calculateWithdrawals(employee._id);

                // Calculate the salary
                const totalSalary = workedHours * hourlyRate;
                const finalSalary = totalSalary - totalWithdrawals;

                // Update the existing salary record with the new values
                existingSalary.totalWorkedHours = workedHours;
                existingSalary.totalSalary = totalSalary;
                existingSalary.totalWithdrawals = totalWithdrawals;
                existingSalary.finalSalary = finalSalary;
                existingSalary.withdrawals = withdrawals.map((w) => w._id); // Link withdrawals
                existingSalary.remainingAmount = finalSalary;

                // Save the updated salary record
                await existingSalary.save();

                // Update employee's status if needed
                employee.status = finalSalary > 0 ? 'active' : 'expired';
                await employee.save();
            } else {
                console.log(`Salary for employee ${employee._id} not found. Creating new salary record...`);

                // If no salary record exists, calculate the salary and create a new record
                const hourlyRate = employee.hourlyRate;
                const attendances = await Attendance.find({ employee: employee._id }).sort({ checkTime: 1 });

                // Calculate total worked hours
                const workedHours = calculateWorkedHours(attendances);

                // Calculate total withdrawals and get withdrawal details
                const { totalWithdrawals, withdrawals } = await calculateWithdrawals(employee._id);

                // Calculate the salary
                const totalSalary = workedHours * hourlyRate;
                const finalSalary = totalSalary - totalWithdrawals;

                // Create the salary record
                const salary = new Salary({
                    employee: employee._id,
                    startDate: employee.contractStartDate,
                    endDate: employee.contractEndDate,
                    totalWorkedHours: workedHours,
                    hourlyRate: hourlyRate,
                    totalSalary: totalSalary,
                    totalWithdrawals: totalWithdrawals,
                    finalSalary: finalSalary,
                    withdrawals: withdrawals.map((w) => w._id), // Link withdrawals
                    salaryDate: new Date(),
                    remainingAmount: finalSalary,
                    salarySettled: false,
                });

                // Save the new salary to the database
                await salary.save();

                // Update employee's status if needed
                employee.status = finalSalary > 0 ? 'active' : 'expired';
                await employee.save();
            }
        }
    } catch (err) {
        console.error('Error calculating salaries:', err);
    }
};

// Schedule the cron job to run every 5 seconds, but with an additional condition to ensure it doesn't run multiple times in parallel
let isProcessing = false; // Flag to prevent concurrency

cron.schedule('*/5 * * * * *', async () => {
    if (isProcessing) return; // Avoid running the cron job if it's already processing
    isProcessing = true;
    await calculateSalaries();
    isProcessing = false;
});

// Export the function
module.exports = { calculateSalaries };
