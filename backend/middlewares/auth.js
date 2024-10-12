// middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    // استخراج التوكن من رأس الطلب
    const token = req.headers['authorization']?.split(' ')[1];

    // التحقق من وجود التوكن
    if (!token) {
        return res.status(401).json({ message: 'لا يوجد رمز مميز مقدم' });
    }

    try {
        // التحقق من صحة التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // البحث عن المستخدم
        const user = await User.findById(decoded.id).select('-password');

        // تحقق من وجود المستخدم
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        // تعيين معلومات المستخدم في الطلب
        req.user = user;
        next(); // الاستمرار إلى الدالة التالية
    } catch (error) {
        console.error(error); // تسجيل الخطأ لمزيد من المعلومات
        res.status(401).json({ message: 'فشل التحقق من الرمز المميز' });
    }
};

module.exports = authMiddleware;
