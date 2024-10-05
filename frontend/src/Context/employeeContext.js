const Employee = require('../models/Employee');
const MockAttendance = require('../models/MockAttendance');
const Withdrawal = require('../models/Withdrawal');
const multer = require('multer');

// إعداد Multer لتخزين الملفات المرفوعة
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // مجلد حفظ الصور
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
});

const upload = multer({ storage: storage });

// تصدير الدوال الخاصة بالموظفين
module.exports = {
    uploadImage: upload.single('image'),

    // دالة لإنشاء موظف جديد مع رفع صورة
    createEmployee: async (req, res) => {
        try {
            const { firstName, lastName, fingerprint, contractStartDate, contractEndDate, hourlyRate } = req.body;

            if (!firstName || !lastName || !fingerprint || !contractStartDate || !contractEndDate || !hourlyRate) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const existingEmployee = await Employee.findOne({ fingerprint });
            if (existingEmployee) {
                return res.status(400).json({ message: 'Employee with this fingerprint already exists.' });
            }

            const startDate = new Date(contractStartDate);
            const endDate = new Date(contractEndDate);
            const duration = (endDate - startDate) / (1000 * 60 * 60 * 24); // تحويل الفرق إلى أيام

            if (duration < 1 || duration > 15) {
                return res.status(400).json({ message: 'Contract duration must be between 1 and 15 days.' });
            }

            const employeeData = req.body;
            if (req.file) {
                employeeData.image = req.file.path; // حفظ مسار الصورة
            }

            const employee = new Employee(employeeData);
            await employee.save();
            res.status(201).json({ message: 'Employee created successfully', employee });
        } catch (error) {
            console.error('Error creating employee:', error);
            res.status(500).json({ message: 'Error creating employee', error });
        }
    },

    // دالة لتحديث بيانات الموظف مع رفع صورة
    updateEmployee: async (req, res) => {
        try {
            const { firstName, lastName, fingerprint, contractStartDate, contractEndDate, hourlyRate } = req.body;

            if (!firstName || !lastName || !fingerprint || !contractStartDate || !contractEndDate || !hourlyRate) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const startDate = new Date(contractStartDate);
            const endDate = new Date(contractEndDate);
            const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);

            if (duration < 1 || duration > 15) {
                return res.status(400).json({ message: 'Contract duration must be between 1 and 15 days.' });
            }

            const employeeData = req.body;
            if (req.file) {
                employeeData.image = req.file.path; // حفظ مسار الصورة
            }

            const employee = await Employee.findByIdAndUpdate(req.params.id, employeeData, { new: true });
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.status(200).json({ message: 'Employee updated successfully', employee });
        } catch (error) {
            console.error('Error updating employee:', error);
            res.status(500).json({ message: 'Error updating employee', error });
        }
    },

    // دالة لحساب الراتب الأسبوعي
    calculateWeeklySalary: async (req, res) => {
        try {
            const employee = await Employee.findById(req.params.id).populate('mockAttendances').populate('withdrawals');
            if (!employee) return res.status(404).json({ message: 'Employee not found' });

            const hoursWorked = employee.mockAttendances.reduce((total, attendance) => total + attendance.hoursWorked, 0);
            const totalWithdrawals = employee.withdrawals.reduce((total, withdrawal) => total + withdrawal.totalPrice, 0);

            const weeklySalary = employee.calculateWeeklySalary(hoursWorked, totalWithdrawals);
            res.status(200).json({ weeklySalary });
        } catch (error) {
            console.error('Error calculating weekly salary:', error);
            res.status(500).json({ message: 'Error calculating weekly salary', error });
        }
    },

    // دالة لجلب جميع الموظفين
    getEmployees: async (req, res) => {
        try {
            const employees = await Employee.find();
            res.status(200).json(employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({ message: 'Error fetching employees', error });
        }
    },

    // دالة لجلب موظف بواسطة ID
    getEmployeeById: async (req, res) => {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.status(200).json(employee);
        } catch (error) {
            console.error('Error fetching employee:', error);
            res.status(500).json({ message: 'Error fetching employee', error });
        }
    },

    // دالة لحذف موظف
    deleteEmployee: async (req, res) => {
        try {
            const employee = await Employee.findByIdAndDelete(req.params.id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.status(200).json({ message: 'Employee deleted successfully' });
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({ message: 'Error deleting employee', error });
        }
    },

    // دالة لإعادة الموظفين الذين تم تعيينهم في فترة معينة
    getEmployeesByHirePeriod: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required.' });
            }

            const employees = await Employee.find({
                contractStartDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });

            res.status(200).json(employees);
        } catch (error) {
            console.error('Error fetching employees by hire period:', error);
            res.status(500).json({ message: 'Error fetching employees by hire period', error });
        }
    }
};
