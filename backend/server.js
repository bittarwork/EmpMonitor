// app.js
const express = require('express');
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const mockAttendanceRoutes = require('./routes/mockAttendanceRoutes');
const materialRoutes = require('./routes/materialRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const app = express();

app.use(express.json()); // Middleware لتفسير JSON
app.use('/api/employees', employeeRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/mockAttendances', mockAttendanceRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// إعداد اتصال قاعدة البيانات
mongoose.connect('mongodb://localhost:27017/your-database-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
