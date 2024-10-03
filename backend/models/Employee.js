// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fingerprint: { type: String, required: true },
    image: { type: String },
    contractStartDate: { type: Date, required: true },
    contractEndDate: { type: Date, required: true },
    hourlyRate: { type: Number, required: true },
    weeklySalary: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    },
    // حقل للربط مع سجلات الحضور الوهمية
    mockAttendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MockAttendance' }]
});

// دالة لحساب الراتب الأسبوعي
employeeSchema.methods.calculateSalary = function (hoursWorked) {
    return hoursWorked * this.hourlyRate;
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
