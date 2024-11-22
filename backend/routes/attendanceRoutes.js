const express = require('express');
const multer = require('multer');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

// إعداد التخزين باستخدام multer
const upload = multer({ dest: 'uploads/' });

// راوت رفع ملف XML
router.post('/upload', upload.single('file'), attendanceController.uploadAttendance);

router.get('/all', attendanceController.getAllAttendances);

module.exports = router;
