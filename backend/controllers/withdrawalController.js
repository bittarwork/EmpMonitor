// controllers/withdrawalController.js
const Withdrawal = require('../models/Withdrawal');

// الحصول على جميع المسحوبات
exports.getAllWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find().populate('employee').populate('material');
        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// إضافة سحب جديد
exports.createWithdrawal = async (req, res) => {
    const withdrawal = new Withdrawal(req.body);
    try {
        const savedWithdrawal = await withdrawal.save();
        res.status(201).json(savedWithdrawal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// تحديث سحب
exports.updateWithdrawal = async (req, res) => {
    try {
        const updatedWithdrawal = await Withdrawal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedWithdrawal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// حذف سحب
exports.deleteWithdrawal = async (req, res) => {
    try {
        await Withdrawal.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
