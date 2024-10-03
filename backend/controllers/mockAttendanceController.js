// controllers/mockAttendanceController.js
const MockAttendance = require('../models/MockAttendance');

// الحصول على جميع سجلات الحضور الوهمية
exports.getAllMockAttendances = async (req, res) => {
    try {
        const mockAttendances = await MockAttendance.find().populate('employee');
        res.json(mockAttendances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// إضافة سجل حضور وهمي جديد
exports.createMockAttendance = async (req, res) => {
    const mockAttendance = new MockAttendance(req.body);
    try {
        const savedMockAttendance = await mockAttendance.save();
        res.status(201).json(savedMockAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// تحديث سجل حضور وهمي
exports.updateMockAttendance = async (req, res) => {
    try {
        const updatedMockAttendance = await MockAttendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMockAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// حذف سجل حضور وهمي
exports.deleteMockAttendance = async (req, res) => {
    try {
        await MockAttendance.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
