const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fingerprint: { type: String, required: true },
    image: { type: String },  // حقل لتخزين مسار الصورة
    contractStartDate: { type: Date, required: true },
    contractEndDate: { type: Date, required: true },
    hourlyRate: { type: Number, required: true },
    weeklySalary: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    },
    mockAttendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MockAttendance' }],
    withdrawals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Withdrawal' }]  // حقل جديد للسحب
});

// دالة لحساب الراتب الأسبوعي
employeeSchema.methods.calculateWeeklySalary = function (hoursWorked, totalWithdrawals) {
    return (hoursWorked * this.hourlyRate) - totalWithdrawals;
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
