// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    date: { type: Date, default: Date.now },
    hoursWorked: { type: Number, default: 0 }
});

attendanceSchema.pre('save', function (next) {
    if (this.checkOut) {
        const checkInTime = new Date(this.checkIn).getTime();
        const checkOutTime = new Date(this.checkOut).getTime();
        this.hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60); // تحويل إلى ساعات
    }
    next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
