// routes/mockAttendanceRoutes.js
const express = require('express');
const {
    addAttendance,
    updateAttendance,
    getAllAttendances,
    getAttendanceById,
    deleteAttendance,
    calculateHoursWorked
} = require('../controllers/mockAttendanceController');

const router = express.Router();

// نقاط النهاية
router.post('/', addAttendance); // إضافة حضور جديد
router.put('/:id', updateAttendance); // تحديث سجل حضور
router.get('/', getAllAttendances); // الحصول على جميع سجلات الحضور
router.get('/:id', getAttendanceById); // الحصول على سجل حضور بواسطة ID
router.delete('/:id', deleteAttendance); // حذف سجل حضور
router.get('/employee/:employeeId/date/:date', calculateHoursWorked); // حساب ساعات العمل لموظف معين في يوم محدد

module.exports = router;
