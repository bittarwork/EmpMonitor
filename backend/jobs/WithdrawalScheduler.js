const cron = require('node-cron');
const Employee = require('../models/Employee');
const Withdrawal = require('../models/Withdrawal');

const synchronizeWithdrawals = async () => {
    try {
        const withdrawals = await Withdrawal.find().populate('employee');
        for (const withdrawal of withdrawals) {
            if (withdrawal.employee) {
                const employee = await Employee.findById(withdrawal.employee._id);
                if (employee) {
                    if (!employee.withdrawals.includes(withdrawal._id)) {
                        employee.withdrawals.push(withdrawal._id);
                    }
                    await employee.save();
                }
            }
        }
    } catch (error) {
        console.error('Error occurred during synchronization:', error);
    }
};

const scheduleWithdrawalsSynchronization = () => {
    cron.schedule('*/5 * * * * *', () => {
        synchronizeWithdrawals();
    });
};

module.exports = { scheduleWithdrawalsSynchronization };
