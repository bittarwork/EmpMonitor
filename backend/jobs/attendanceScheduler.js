const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// الوظيفة المجدولة لتحديث حضور الموظفين
const updateEmployeeAttendances = async () => {
    try {
        // جلب جميع سجلات الحضور مع الموظفين المرتبطين
        const attendances = await Attendance.find().populate('employee');

        // إنشاء خريطة لتجميع الحضور لكل موظف
        const employeeAttendanceMap = {};

        for (const attendance of attendances) {
            if (attendance.employee && attendance.employee._id) {
                const employeeId = attendance.employee._id.toString();

                // إذا لم تكن هناك قائمة للسجلات الحالية، يتم إنشاء واحدة
                if (!employeeAttendanceMap[employeeId]) {
                    employeeAttendanceMap[employeeId] = [];
                }
                // إضافة سجل الحضور إلى قائمة الموظف
                employeeAttendanceMap[employeeId].push(attendance._id);
            } else {
                try {
                    // حذف السجل غير المرتبط بموظف
                    await Attendance.findByIdAndDelete(attendance._id);
                } catch (error) {
                    console.error(`Error deleting attendance record ${attendance._id}:`, error);
                }
            }
        }

        // تحديث الموظفين بحقول الحضور
        for (const employeeId in employeeAttendanceMap) {
            try {
                await Employee.findByIdAndUpdate(employeeId, {
                    mockAttendances: employeeAttendanceMap[employeeId],
                });
            } catch (error) {
                console.error(`Error updating employee ${employeeId} attendances:`, error);
            }
        }
    } catch (error) {
        console.error('Error updating employee attendances:', error);
    }
};

// جدولة الوظيفة لتعمل كل دقيقة
const scheduleAttendanceUpdate = () => {
    cron.schedule('*/5 * * * * *', async () => {
        await updateEmployeeAttendances();
    });
};

module.exports = scheduleAttendanceUpdate;
