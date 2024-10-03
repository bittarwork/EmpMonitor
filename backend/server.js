// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// تحميل المتغيرات البيئية
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// ميدل وير للتعامل مع JSON
app.use(express.json());

// استيراد المسارات
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');

// إعداد المسارات
app.use('/api/employees', employeeRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
