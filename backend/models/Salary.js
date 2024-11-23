const mongoose = require('mongoose');

// تعريف الموديل الخاص بالراتب
const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalWorkedHours: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    totalSalary: {
        type: Number,
        default: 0
    },
    totalWithdrawals: {
        type: Number,
        default: 0
    },
    finalSalary: {
        type: Number,
        default: 0
    },
    withdrawals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Withdrawal'
    }],
    salaryDate: {
        type: Date,
        default: Date.now
    },
    salaryPaidDate: {
        type: Date,
        default: null
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        default: 0
    },
    salarySettled: {
        type: Boolean,
        default: false
    },
    settledDate: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ''
    }
});

// إنشاء موديل الراتب
const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
