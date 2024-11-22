const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    checkTime: {
        type: Date,
        required: true
    },
    sourceData: {
        type: String,
        default: ''
    }
}, { timestamps: true });
attendanceSchema.index({ employee: 1, checkTime: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
