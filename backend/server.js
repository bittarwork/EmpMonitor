const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const employeeRoutes = require('./routes/employeeRoutes');
const materialRoutes = require('./routes/materialRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');

// Import scheduled jobs
const scheduleAttendanceUpdate = require('./jobs/attendanceScheduler');
const { scheduleWithdrawalsSynchronization } = require('./jobs/WithdrawalScheduler');
const { calculateSalaries } = require('./jobs/SalariesScheduler');

const app = express();

// Logger Middleware to log incoming requests
app.use((req, res, next) => {
    console.log('\n======================');
    console.log(`🌐 Incoming Request: ${req.method} ${req.path}`);

    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Request Data:', JSON.stringify(req.body, null, 2));
    } else {
        console.log('📦 No data attached.');
    }

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

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Static folder for file uploads
app.use('/uploads', express.static('uploads'));

// Simple GET route
app.get('/api', (req, res) => {
    res.send('Welcome to the API!');
});

// Use imported routes
app.use('/api/employees', employeeRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);

// Schedule jobs
scheduleAttendanceUpdate();
scheduleWithdrawalsSynchronization();
calculateSalaries();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/rqt-123')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Could not connect to MongoDB', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
