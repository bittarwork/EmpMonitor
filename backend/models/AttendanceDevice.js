// models/AttendanceDevice.js
const mongoose = require('mongoose');

const attendanceDeviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    deviceName: { type: String, required: true },
    location: { type: String }
});

const AttendanceDevice = mongoose.model('AttendanceDevice', attendanceDeviceSchema);

module.exports = AttendanceDevice;
