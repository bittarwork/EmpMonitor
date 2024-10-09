// routes/withdrawalRoutes.js
const express = require('express');
const {
    createWithdrawal,
    updateWithdrawal,
    getWithdrawalsGroupedByEmployee,
    getWithdrawalById,
    deleteWithdrawal,
    deleteWithdrawalsByEmployeeId
} = require('../controllers/withdrawalController');

const router = express.Router();

// Route لإنشاء سحب جديد
router.post('/', createWithdrawal);

// Route لتحديث سحب موجود
router.put('/:id', updateWithdrawal);

// Route لجلب جميع السحوبات مجمعة حسب الموظف
router.get('/', getWithdrawalsGroupedByEmployee);

// Route لجلب سحب بواسطة ID
router.get('/:id', getWithdrawalById);

// Route لحذف سحب
router.delete('/:id', deleteWithdrawal);

// مسار لحذف جميع السحوبات الخاصة بموظف معين
router.delete('/employee/:employeeId', deleteWithdrawalsByEmployeeId);


module.exports = router;
