// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth'); // للتوثيق باستخدام التوكن

const router = express.Router();

// نقاط النهاية
router.post('/register', registerUser); // تسجيل مستخدم جديد
router.post('/login', loginUser); // تسجيل الدخول
router.get('/profile', authMiddleware, getUserProfile); // الحصول على معلومات المستخدم مع التوثيق

module.exports = router;
