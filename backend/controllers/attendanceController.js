// controllers/attendanceController.js
const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// دالة لتحليل ملف CSV وإدراج معلوماته في قاعدة البيانات
async function processAttendanceCSV(filePath) {
    const attendanceData = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ headers: ['رقم البطاقة', 'المكان', 'التاريخ والوقت', 'الاسم', 'الادارة'] }))
            .on('data', (row) => {
                row.dateTime = moment(row['التاريخ والوقت'], 'DD/MM/YYYY HH:mm');
                row.firstName = row['الاسم'].split(' ')[0];
                row.lastName = row['الاسم'].split(' ')[1] || '';
                attendanceData.push(row);
            })
            .on('end', async () => {
                for (const record of attendanceData) {
                    await matchAndSaveAttendance(record);
                }
                resolve();
            })
            .on('error', (error) => reject(error));
    });
}

// دالة لمطابقة السجل مع الموظف وتخزين الحضور
async function matchAndSaveAttendance(record) {
    try {
        const employee = await Employee.findOne({
            firstName: record.firstName,
            lastName: record.lastName,
            fingerprint: record['رقم البطاقة']
        });

        if (employee) {
            const attendance = new Attendance({
                employee: employee._id,
                date: record.dateTime.toDate(),
                time: record.dateTime.format('HH:mm'),
                location: record['المكان']
            });

            await attendance.save();
        } else {
            console.log(`Employee with name ${record.firstName} ${record.lastName} and card number ${record['رقم البطاقة']} not found`);
        }
    } catch (error) {
        console.error('Error saving attendance record:', error);
    }
}

module.exports = { processAttendanceCSV };
