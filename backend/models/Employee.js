const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fingerprint: { type: String, required: true },
    image: { type: String, optional: true },
    contractStartDate: { type: Date, required: true },
    contractEndDate: { type: Date, required: true },
    hourlyRate: { type: Number, required: true },
    weeklySalary: { type: Number, calculated: true },
    status: { type: String, enum: ['active', 'expired'] },
    // إضافة حقل للحضور الوهمي
    mockAttendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }] // مرجع إلى نموذج الحضور
});

module.exports = mongoose.model('Employee', employeeSchema);
