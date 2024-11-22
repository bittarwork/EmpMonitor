const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// الوظيفة المجدولة
const updateEmployeeAttendances = async () => {
    try {

        // جلب جميع سجلات الحضور مع الموظفين المرتبطين
        const attendances = await Attendance.find().populate('employee');

        // إنشاء خريطة لتجميع الحضور لكل موظف
        const employeeAttendanceMap = {};

        attendances.forEach(attendance => {
            const employeeId = attendance.employee._id.toString();

            // إذا لم تكن هناك قائمة للسجلات الحالية، يتم إنشاء واحدة
            if (!employeeAttendanceMap[employeeId]) {
                employeeAttendanceMap[employeeId] = [];
            }
            // إضافة سجل الحضور إلى قائمة الموظف
            employeeAttendanceMap[employeeId].push(attendance._id);
        });

        // تحديث الموظفين بحقول الحضور
        for (const employeeId in employeeAttendanceMap) {
            await Employee.findByIdAndUpdate(employeeId, {
                mockAttendances: employeeAttendanceMap[employeeId],
            });
        }
    } catch (error) {
        console.error('Error updating employee attendances:', error);
    }
};

// جدولة الوظيفة لتعمل كل 5 ثوانٍ
const scheduleAttendanceUpdate = () => {
    cron.schedule('*/5 * * * * *', async () => {
        await updateEmployeeAttendances();
    });
};

module.exports = scheduleAttendanceUpdate;
