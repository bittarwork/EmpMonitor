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
            const workedTime = (new Date(exit.checkTime) - new Date(entry.checkTime)) / 3600000;
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

const calculateSalaries = async () => {
    try {
        const today = new Date();

        // Fetch all employees
        const employees = await Employee.find().populate('mockAttendances');

        for (let employee of employees) {
            const contractStartDate = new Date(employee.contractStartDate);
            const contractEndDate = new Date(employee.contractEndDate);

            // Skip employees with expired contracts
            if (today > contractEndDate) {
                continue;
            }

            // Check if salary has already been calculated for this period
            const existingSalary = await Salary.findOne({
                employee: employee._id,
                startDate: contractStartDate,
                endDate: contractEndDate,
            });

            const hourlyRate = employee.hourlyRate;
            const attendances = await Attendance.find({ employee: employee._id }).sort({ checkTime: 1 });

            // Calculate total worked hours
            const workedHours = calculateWorkedHours(attendances);

            // Calculate total withdrawals and get withdrawal details
            const { totalWithdrawals, withdrawals } = await calculateWithdrawals(employee._id);

            // Calculate the salary
            const totalSalary = workedHours * hourlyRate;
            const finalSalary = totalSalary - totalWithdrawals;

            if (existingSalary) {
                // Update remaining amount if any payments have been made
                const paidAmount = existingSalary.paidAmount || 0;
                const remainingAmount = finalSalary - paidAmount;

                existingSalary.totalWorkedHours = workedHours;
                existingSalary.totalSalary = totalSalary;
                existingSalary.totalWithdrawals = totalWithdrawals;
                existingSalary.finalSalary = finalSalary;
                existingSalary.remainingAmount = Math.max(0, remainingAmount); // Ensure no negative amounts
                existingSalary.withdrawals = withdrawals.map((w) => w._id);

                await existingSalary.save();
            } else {
                // Create the salary record
                const salary = new Salary({
                    employee: employee._id,
                    startDate: contractStartDate,
                    endDate: contractEndDate,
                    totalWorkedHours: workedHours,
                    hourlyRate: hourlyRate,
                    totalSalary: totalSalary,
                    totalWithdrawals: totalWithdrawals,
                    finalSalary: finalSalary,
                    withdrawals: withdrawals.map((w) => w._id),
                    salaryDate: today,
                    remainingAmount: finalSalary,
                    paidAmount: 0, // Initialize as no payment made yet
                    salarySettled: false,
                });

                await salary.save();
            }

            // Update employee's status if the contract is expired and salary is fully settled
            if (today > contractEndDate && existingSalary && existingSalary.remainingAmount <= 0) {
                employee.status = 'expired';
                await employee.save();
            } else {
                employee.status = 'active';
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
