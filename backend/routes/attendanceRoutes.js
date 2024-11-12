// routes/attendanceRoutes.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser'); // تأكد من استدعاء المكتبة هنا

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// راوت رفع الحضور
router.post('/upload-attendance', upload.single('attendanceFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const attendances = [];

    // قراءة البيانات من الملف باستخدام csv-parser مع التأكد من استخدام الفاصل \t
    fs.createReadStream(filePath, { encoding: 'utf8' })
        .pipe(csv({ separator: '\t' })) // تأكد من أن الفاصل هو tab إذا كان الملف tab-delimited
        .on('data', (row) => {
            console.log(row); // تحقق من البيانات القادمة من الملف
            try {
                const employeeName = row['الإسم']; // تأكد من أن هذه هي التسمية الصحيحة في الملف
                const fingerprint = row['رقم البصمه'];
                const dateTime = row['التاريخ والوقت'];
                const location = row['المكان'];

                // التأكد من أن التاريخ والوقت غير فارغين
                if (dateTime && dateTime.includes(' ')) {
                    const [date, time] = dateTime.split(' '); // تقسيم التاريخ والوقت
                    const [day, month, year] = date.split('/'); // تقسيم التاريخ إلى يوم، شهر، سنة

                    // تحويل التاريخ إلى تنسيق صحيح
                    const formattedDate = new Date(`${year}-${month}-${day}T${time}:00`); // تحويل التاريخ والوقت إلى تنسيق صالح

                    // التأكد من أن التاريخ تم تحليله بشكل صحيح
                    if (isNaN(formattedDate)) {
                        console.log('Invalid dateTime format:', dateTime);
                    } else {
                        // دفع بيانات الحضور إلى المصفوفة
                        attendances.push({
                            employeeName,
                            fingerprint,
                            dateTime: formattedDate,
                            location,
                        });
                    }
                } else {
                    console.log('Invalid dateTime format or missing value:', dateTime);
                }
            } catch (err) {
                console.error('Error parsing row:', err);
            }
        })
        .on('end', async () => {
            try {
                // قم بمطابقة وحفظ بيانات الحضور هنا
                for (const attendance of attendances) {
                    const employee = await Employee.findOne({
                        firstName: attendance.employeeName.split(' ')[0], // أخذ الاسم الأول
                        lastName: attendance.employeeName.split(' ')[1], // أخذ الاسم الأخير
                        fingerprint: attendance.fingerprint, // المطابقة باستخدام رقم البصمة
                    });

                    if (employee) {
                        // حفظ بيانات الحضور في قاعدة البيانات
                        await Attendance.create({
                            employee: employee._id,
                            date: attendance.dateTime, // تم تحويل التاريخ والوقت إلى تنسيق صالح
                            location: attendance.location,
                        });
                    } else {
                        console.log(`Employee with name ${attendance.employeeName} and fingerprint ${attendance.fingerprint} not found`);
                    }
                }

                res.json({ message: 'Attendance data processed and saved successfully' });
            } catch (err) {
                console.error('Error saving attendance:', err);
                res.status(500).json({ error: 'Failed to process attendance file' });
            }
        });
});

module.exports = router;
