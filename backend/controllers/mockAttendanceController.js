// controllers/mockAttendanceController.js
const MockAttendance = require('../models/MockAttendance');
const Employee = require('../models/Employee'); // تأكد من أن لديك نموذج الموظف

// 1. إضافة حضور جديد
exports.addAttendance = async (req, res) => {
    try {
        const { employee, checkIn, checkOut } = req.body;

        // تحقق من وجود الموظف
        const foundEmployee = await Employee.findById(employee);
        if (!foundEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // إنشاء سجل حضور جديد
        const attendance = new MockAttendance({ employee, checkIn, checkOut });
        await attendance.save();

        res.status(201).json({ message: 'Attendance record added', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. تحديث سجل حضور
exports.updateAttendance = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;

    try {
        const attendance = await MockAttendance.findById(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        attendance.checkIn = checkIn || attendance.checkIn;
        attendance.checkOut = checkOut || attendance.checkOut;
        await attendance.save();

        res.json({ message: 'Attendance record updated', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. الحصول على جميع سجلات الحضور
exports.getAllAttendances = async (req, res) => {
    try {
        const attendances = await MockAttendance.find().populate('employee', 'name'); // استبدل 'name' بالحقول المطلوبة
        res.json(attendances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. الحصول على سجل حضور بواسطة ID
exports.getAttendanceById = async (req, res) => {
    const { id } = req.params;

    try {
        const attendance = await MockAttendance.findById(id).populate('employee', 'name');
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. حذف سجل حضور
exports.deleteAttendance = async (req, res) => {
    const { id } = req.params;

    try {
        const attendance = await MockAttendance.findByIdAndDelete(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.json({ message: 'Attendance record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. حساب ساعات العمل لموظف معين
exports.calculateHoursWorked = async (req, res) => {
    const { employeeId, date } = req.params;

    try {
        const attendances = await MockAttendance.find({
            employee: employeeId,
            date: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) } // الحصول على سجلات اليوم المحدد
        });

        const totalHours = attendances.reduce((total, record) => total + record.hoursWorked, 0);
        res.json({ employeeId, totalHours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
