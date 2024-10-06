const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // استيراد حزمة cors
const employeeRoutes = require('./routes/employeeRoutes');
const mockAttendanceRoutes = require('./routes/mockAttendanceRoutes');
const materialRoutes = require('./routes/materialRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

// إعداد CORS للسماح بالوصول من المنفذ 3000
app.use(cors({
    origin: 'http://localhost:3000', // عنوان الفرونت إند
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // الطرق المسموح بها
    allowedHeaders: ['Content-Type', 'Authorization'], // رؤوس HTTP المسموح بها
    credentials: true // إذا كنت تستخدم ملفات تعريف الارتباط
}));

// Middleware to parse JSON requests
app.use(express.json());
// إعداد المجلد للصور المرفوعة
app.use('/uploads', express.static('uploads'));

// إضافة مسار GET بسيط
app.get('/api', (req, res) => {
    res.send('Welcome to the API!');
});

// استخدام المسارات الأخرى
app.use('/api/employees', employeeRoutes);
app.use('/api/mockAttendances', mockAttendanceRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/users', userRoutes);

// إعداد اتصال قاعدة البيانات
mongoose.connect('mongodb://localhost:27017/r')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// بدء تشغيل الخادم على المنفذ المحدد أو 5000 افتراضيًا
const PORT = process.env.PORT || 5000; // تغيير إلى 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
