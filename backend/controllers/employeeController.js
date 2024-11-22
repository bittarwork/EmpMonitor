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

exports.uploadImage = upload.single('image');
// دالة لإنشاء موظف جديد
exports.createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, fingerprint, contractStartDate, contractEndDate, hourlyRate } = req.body;

        // التحقق من تكرار الاسماء والبصمة
        const existingEmployee = await Employee.findOne({
            $or: [
                { firstName, lastName }, // تحقق من الاسم الأول واسم العائلة
                { fingerprint } // تحقق من بصمة الأصبع
            ]
        });

        if (existingEmployee) {
            return res.status(400).json({
                message: 'الاسم أو البصمة موجودة بالفعل. يرجى استخدام معلومات مختلفة.'
            });
        }

        const image = req.file ? req.file.path : undefined;

        const newEmployee = new Employee({
            firstName,
            lastName,
            fingerprint,
            contractStartDate,
            contractEndDate,
            hourlyRate,
            image // إضافة مسار الصورة
        });

        const savedEmployee = await newEmployee.save();

        // بناء المسار الكامل للصورة
        const employeeWithImage = {
            id: savedEmployee._id,
            firstName: savedEmployee.firstName,
            lastName: savedEmployee.lastName,
            fingerprint: savedEmployee.fingerprint,
            contractStartDate: savedEmployee.contractStartDate,
            contractEndDate: savedEmployee.contractEndDate,
            hourlyRate: savedEmployee.hourlyRate,
            image: `${req.protocol}://${req.get('host')}/${savedEmployee.image}`,
        };

        res.status(201).json(employeeWithImage);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Error creating employee', error });
    }
};

// دالة لتعديل بيانات الموظف
exports.updateEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { firstName, lastName, fingerprint, image, contractStartDate, contractEndDate, hourlyRate } = req.body;

        // العثور على الموظف من قاعدة البيانات
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'الموظف غير موجود' });
        }

        // التحقق من تكرار الاسماء والبصمة باستثناء الموظف الحالي
        const existingEmployee = await Employee.findOne({
            $or: [
                { firstName, lastName },
                { fingerprint }
            ],
            _id: { $ne: employeeId } // استثناء الموظف الحالي
        });

        if (existingEmployee) {
            return res.status(400).json({
                message: 'الاسم أو البصمة موجودة بالفعل. يرجى استخدام معلومات مختلفة.'
            });
        }

        // الحصول على التاريخ الحالي
        const currentDate = new Date();
        // ضبط تاريخ بداية العقد
        const startDate = new Date(contractStartDate);

        // التحقق من أن تاريخ بداية العقد هو إما اليوم أو لا يتجاوز 15 يوم من اليوم
        if (startDate < currentDate || startDate > new Date(currentDate.setDate(currentDate.getDate() + 15))) {
            return res.status(400).json({ message: 'تاريخ بداية العقد يجب أن يكون اليوم أو خلال 15 يومًا من اليوم الحالي.' });
        }

        // تحديث بيانات الموظف
        employee.firstName = firstName || employee.firstName;
        employee.lastName = lastName || employee.lastName;
        employee.fingerprint = fingerprint || employee.fingerprint;
        employee.image = image || employee.image;
        employee.contractStartDate = contractStartDate || employee.contractStartDate;
        employee.contractEndDate = contractEndDate || employee.contractEndDate;
        employee.hourlyRate = hourlyRate || employee.hourlyRate;

        // حفظ التعديلات في قاعدة البيانات
        await employee.save();

        res.status(200).json({ message: 'تم تحديث بيانات الموظف بنجاح', employee });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء تعديل بيانات الموظف', error: error.message });
    }
};



// دالة لحساب الراتب الأسبوعي
exports.calculateWeeklySalary = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('mockAttendances') // جلب جميع سجلات الحضور المرتبطة
            .populate('withdrawals');     // جلب جميع السحوبات المرتبطة

        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const hoursWorked = employee.mockAttendances.reduce((total, attendance) => total + attendance.hoursWorked, 0);
        const totalWithdrawals = employee.withdrawals.reduce((total, withdrawal) => total + withdrawal.totalPrice, 0);

        const weeklySalary = employee.calculateWeeklySalary(hoursWorked, totalWithdrawals);
        res.status(200).json({ weeklySalary });
    } catch (error) {
        console.error('Error calculating weekly salary:', error);
        res.status(500).json({ message: 'Error calculating weekly salary', error });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('mockAttendances') // جلب جميع سجلات الحضور المرتبطة
            .populate('withdrawals');     // جلب جميع السحوبات المرتبطة

        // إضافة مسار الصورة إلى كل موظف
        const employeesWithImages = employees.map(employee => ({
            id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fingerprint: employee.fingerprint,
            contractStartDate: employee.contractStartDate,
            contractEndDate: employee.contractEndDate,
            hourlyRate: employee.hourlyRate,
            image: `${req.protocol}://${req.get('host')}/${employee.image}`, // بناء مسار الصورة
            mockAttendances: employee.mockAttendances,
            withdrawals: employee.withdrawals,
        }));

        res.status(200).json(employeesWithImages);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Error fetching employees', error });
    }
};
// دالة لاسترجاع معلومات موظف بناءً على معرفه
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params; // احصل على معرف الموظف من المعلمات
        const employee = await Employee.findById(id);

        // تحقق مما إذا كان الموظف موجودًا
        if (!employee) {
            return res.status(404).json({ message: 'الموظف غير موجود.' });
        }

        // بناء المسار الكامل للصورة
        const employeeDetails = {
            id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fingerprint: employee.fingerprint,
            contractStartDate: employee.contractStartDate,
            contractEndDate: employee.contractEndDate,
            hourlyRate: employee.hourlyRate,
            image: `${req.protocol}://${req.get('host')}/${employee.image}`, // بناء مسار الصورة
            mockAttendances: employee.mockAttendances,
            withdrawals: employee.withdrawals
        };

        res.status(200).json(employeeDetails);
    } catch (error) {
        console.error('Error retrieving employee:', error);
        res.status(500).json({ message: 'خطأ في استرجاع معلومات الموظف.', error });
    }
};

// دالة لحذف موظف
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Error deleting employee', error });
    }
};

// دالة لإعادة الموظفين الذين تم تعيينهم في فترة معينة
exports.getEmployeesByHirePeriod = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // تحقق من وجود التواريخ
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }

        const employees = await Employee.find({
            contractStartDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
            .populate('mockAttendances') // جلب جميع سجلات الحضور المرتبطة
            .populate('withdrawals');     // جلب جميع السحوبات المرتبطة

        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees by hire period:', error);
        res.status(500).json({ message: 'Error fetching employees by hire period', error });
    }
};