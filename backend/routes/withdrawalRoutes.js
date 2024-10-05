// routes/withdrawalRoutes.js
const express = require('express');
const {
    createWithdrawal,
    updateWithdrawal,
    getWithdrawals,
    getWithdrawalById,
    deleteWithdrawal,
    getWithdrawalsByEmployee,
    calculateTotalWithdrawals
} = require('../controllers/withdrawalController');

const router = express.Router();

// Route لإنشاء سحب جديد
router.post('/', createWithdrawal);

// Route لتحديث سحب موجود
router.put('/:id', updateWithdrawal);

// Route لجلب جميع السحوبات
router.get('/', getWithdrawals);

// Route لجلب سحب بواسطة ID
router.get('/:id', getWithdrawalById);

// Route لحذف سحب
router.delete('/:id', deleteWithdrawal);

// Route للحصول على سحوبات موظف معين
router.get('/employee/:employeeId', getWithdrawalsByEmployee);

// Route لحساب القيمة الإجمالية للسحوبات
router.get('/total-value', calculateTotalWithdrawals);

module.exports = router;
