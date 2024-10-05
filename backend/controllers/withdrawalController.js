// controllers/withdrawalController.js
const Withdrawal = require('../models/Withdrawal');
const Employee = require('../models/Employee');
const Material = require('../models/Material');

// دالة لإنشاء سحب جديد
exports.createWithdrawal = async (req, res) => {
    try {
        const { employee, material, quantity, note } = req.body;

        // تحقق من وجود البيانات المطلوبة
        if (!employee || !material || !quantity) {
            return res.status(400).json({ message: 'Employee, material, and quantity are required.' });
        }

        // تحقق من وجود الموظف
        const foundEmployee = await Employee.findById(employee);
        if (!foundEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // تحقق من وجود المادة
        const foundMaterial = await Material.findById(material);
        if (!foundMaterial) {
            return res.status(404).json({ message: 'Material not found' });
        }

        const withdrawalData = {
            employee,
            material,
            quantity,
            note
        };

        const withdrawal = new Withdrawal(withdrawalData);
        await withdrawal.save();
        res.status(201).json({ message: 'Withdrawal created successfully', withdrawal });
    } catch (error) {
        console.error('Error creating withdrawal:', error);
        res.status(500).json({ message: 'Error creating withdrawal', error });
    }
};

// دالة لتحديث سحب موجود
exports.updateWithdrawal = async (req, res) => {
    try {
        const { employee, material, quantity, note } = req.body;

        // تحقق من وجود البيانات المطلوبة
        if (!employee || !material || !quantity) {
            return res.status(400).json({ message: 'Employee, material, and quantity are required.' });
        }

        const withdrawal = await Withdrawal.findByIdAndUpdate(req.params.id, {
            employee,
            material,
            quantity,
            note
        }, { new: true });

        if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
        res.status(200).json({ message: 'Withdrawal updated successfully', withdrawal });
    } catch (error) {
        console.error('Error updating withdrawal:', error);
        res.status(500).json({ message: 'Error updating withdrawal', error });
    }
};

// دالة لجلب جميع السحوبات
exports.getWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find().populate('employee').populate('material');
        res.status(200).json(withdrawals);
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        res.status(500).json({ message: 'Error fetching withdrawals', error });
    }
};

// دالة لجلب سحب بواسطة ID
exports.getWithdrawalById = async (req, res) => {
    try {
        const withdrawal = await Withdrawal.findById(req.params.id).populate('employee').populate('material');
        if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
        res.status(200).json(withdrawal);
    } catch (error) {
        console.error('Error fetching withdrawal:', error);
        res.status(500).json({ message: 'Error fetching withdrawal', error });
    }
};

// دالة لحذف سحب
exports.deleteWithdrawal = async (req, res) => {
    try {
        const withdrawal = await Withdrawal.findByIdAndDelete(req.params.id);
        if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
        res.status(200).json({ message: 'Withdrawal deleted successfully' });
    } catch (error) {
        console.error('Error deleting withdrawal:', error);
        res.status(500).json({ message: 'Error deleting withdrawal', error });
    }
};

// دالة للحصول على سحوبات موظف معين
exports.getWithdrawalsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const withdrawals = await Withdrawal.find({ employee: employeeId }).populate('material');
        res.status(200).json(withdrawals);
    } catch (error) {
        console.error('Error fetching withdrawals by employee:', error);
        res.status(500).json({ message: 'Error fetching withdrawals by employee', error });
    }
};

// دالة لحساب القيمة الإجمالية للسحوبات
exports.calculateTotalWithdrawals = async (req, res) => {
    try {
        const totalWithdrawals = await Withdrawal.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' }
                }
            }
        ]);

        res.status(200).json({ total: totalWithdrawals[0]?.total || 0 });
    } catch (error) {
        console.error('Error calculating total withdrawals:', error);
        res.status(500).json({ message: 'Error calculating total withdrawals', error });
    }
};
