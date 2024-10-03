// routes/mockAttendanceRoutes.js
const express = require('express');
const router = express.Router();
const mockAttendanceController = require('../controllers/mockAttendanceController');

router.get('/', mockAttendanceController.getAllMockAttendances);
router.post('/', mockAttendanceController.createMockAttendance);
router.put('/:id', mockAttendanceController.updateMockAttendance);
router.delete('/:id', mockAttendanceController.deleteMockAttendance);

module.exports = router;
