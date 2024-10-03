// controllers/attendanceController.js
const Attendance = require('../models/Attendance');

// الحصول على جميع سجلات الحضور
exports.getAllAttendances = async (req, res) => {
    try {
        const attendances = await Attendance.find().populate('employee');
        res.json(attendances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// إضافة سجل حضور جديد
exports.createAttendance = async (req, res) => {
    const attendance = new Attendance(req.body);
    try {
        const savedAttendance = await attendance.save();
        res.status(201).json(savedAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// تحديث سجل حضور
exports.updateAttendance = async (req, res) => {
    try {
        const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// حذف سجل حضور
exports.deleteAttendance = async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
