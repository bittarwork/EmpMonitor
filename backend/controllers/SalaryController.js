const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const Withdrawal = require('../models/Withdrawal');

// Controller function to fetch all salaries with full details
const getAllSalaries = async (req, res) => {
    try {
        // Fetch all salaries and populate necessary fields
        const salaries = await Salary.find()
            .populate({
                path: 'employee', // Populate employee information
                select: 'firstName lastName hourlyRate contractStartDate contractEndDate status' // Select only the fields you need
            })
            .populate({
                path: 'withdrawals', // Populate withdrawal details
                populate: {
                    path: 'material', // Populate material details for each withdrawal
                    select: 'name price' // Select only the fields you need
                }
            });

        // Check if salaries exist
        if (!salaries || salaries.length === 0) {
            return res.status(404).json({ message: 'No salaries found.' });
        }

        // Log salaries for debugging purposes
        console.log(salaries);

        // Send the response with the fetched salaries and their related information
        res.status(200).json(salaries);
    } catch (err) {
        // Handle errors
        console.error('Error fetching salaries:', err);
        res.status(500).json({ message: 'Server error while fetching salaries.' });
    }
};

// تحديث الرواتب
const updateSalary = async (req, res) => {
    const { id } = req.params; // أخذ معرّف الراتب من الـ URL
    const { amount, note, employeeId } = req.body; // أخذ البيانات من الفورم

    // التحقق من البيانات المدخلة
    if (!amount || !employeeId) {
        return res.status(400).json({ error: 'Amount and Employee ID are required.' });
    }

    try {
        // البحث عن الموظف
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        // البحث عن سجل الراتب للموظف
        const salary = await Salary.findById(id);
        if (!salary) {
            return res.status(404).json({ error: 'Salary record not found.' });
        }

        // تحديث البيانات
        salary.amount = amount;
        salary.note = note || salary.note; // إذا لم يتم إدخال ملاحظة، نحتفظ بالملاحظة القديمة

        // تحديث الحقول المحسوبة تلقائيًا
        salary.totalSalary = salary.totalWorkedHours * salary.hourlyRate;
        salary.finalSalary = salary.totalSalary - salary.totalWithdrawals;
        salary.remainingAmount = salary.finalSalary - salary.paidAmount;

        await salary.save();

        // إرسال الرد
        res.status(200).json({
            message: 'Salary updated successfully!',
            salary
        });
    } catch (err) {
        console.error('Error updating salary:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

const paySalary = async (req, res) => {
    try {
        const { salaryId, paidAmount } = req.body;

        // التحقق من وجود salaryId و paidAmount
        if (!salaryId || !paidAmount || paidAmount <= 0) {
            return res.status(400).json({ message: 'Invalid salaryId or paidAmount' });
        }

        // جلب الراتب من قاعدة البيانات
        const salary = await Salary.findById(salaryId);

        if (!salary) {
            return res.status(404).json({ message: 'Salary not found' });
        }

        // تحديث الحقول المتعلقة بالدفع
        salary.paidAmount += paidAmount; // إضافة المبلغ المدفوع
        salary.remainingAmount -= paidAmount; // خصم المبلغ من المتبقي

        // التحقق من اكتمال الدفع
        if (salary.remainingAmount <= 0) {
            salary.salarySettled = true;
            salary.settledDate = new Date(); // تعيين تاريخ التسوية
            salary.remainingAmount = 0; // التأكد من أن المتبقي صفر
        }
        // 6062450
        // حفظ التحديثات
        await salary.save();

        // إرجاع الرد
        return res.status(200).json({
            message: 'Payment processed successfully',
            updatedSalary: salary,
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    getAllSalaries,
    updateSalary,
    paySalary,
};