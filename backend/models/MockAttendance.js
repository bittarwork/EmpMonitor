// models/MockAttendance.js
const mongoose = require('mongoose');

const mockAttendanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    checkIn: { type: Date, required: true, default: Date.now },
    checkOut: { type: Date },
    date: { type: Date, default: Date.now },
    hoursWorked: { type: Number, default: 0 }
});

// دالة قبل حفظ السجل لحساب الساعات
mockAttendanceSchema.pre('save', function (next) {
    if (this.checkOut) {
        const checkInTime = new Date(this.checkIn).getTime();
        const checkOutTime = new Date(this.checkOut).getTime();
        this.hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60); // تحويل إلى ساعات
    }
    next();
});

// دالة لحساب الراتب استنادًا إلى عدد الساعات
mockAttendanceSchema.methods.calculateSalary = function () {
    return this.hoursWorked * this.employee.hourlyRate; // استخدام أجر الساعة من الموظف
};

const MockAttendance = mongoose.model('MockAttendance', mockAttendanceSchema);

module.exports = MockAttendance;
