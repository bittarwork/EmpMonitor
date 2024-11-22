const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// استيراد المسارات
const employeeRoutes = require('./routes/employeeRoutes');
const materialRoutes = require('./routes/materialRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Logger Middleware to log incoming requests
app.use((req, res, next) => {
    console.log('\n======================');
    console.log(`🌐 Incoming Request: ${req.method} ${req.path}`);

    // Check if request body exists and has keys
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Request Data:', JSON.stringify(req.body, null, 2));
    } else {
        console.log('📦 No data attached.');
    }

    // Save original send function to log response
    const originalSend = res.send;

    res.send = function (body) {
        const responseSummary = typeof body === 'string' ? body.slice(0, 100) : JSON.stringify(body).slice(0, 100);
        console.log(`📝 Server Response (Status: ${res.statusCode}, Length: ${responseSummary.length}):`);
        console.log(responseSummary, '...');
        console.log('======================\n');

        originalSend.call(this, body);
    };

    next();
});


// إعداد CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware لتحليل JSON
app.use(express.json());

// إعداد المجلد للصور المرفوعة
app.use('/uploads', express.static('uploads'));

// إضافة مسار GET بسيط
app.get('/api', (req, res) => {
    res.send('Welcome to the API!');
});

// استخدام المسارات الأخرى
app.use('/api/employees', employeeRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/users', userRoutes);

// إعداد اتصال قاعدة البيانات
mongoose.connect('mongodb://localhost:27017/rqt-123')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Could not connect to MongoDB', err));

// بدء تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});