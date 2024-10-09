const express = require('express'); // استيراد مكتبة Express لإنشاء تطبيق ويب
const {
    createWithdrawal, // استيراد دالة إنشاء سحب جديد
    updateWithdrawal, // استيراد دالة تحديث سحب موجود
    getWithdrawalsGroupedByEmployee, // استيراد دالة جلب السحوبات مجمعة حسب الموظف
    getWithdrawalById, // استيراد دالة جلب سحب بواسطة ID
    deleteWithdrawal, // استيراد دالة حذف سحب
    deleteWithdrawalsByEmployeeId // استيراد دالة لحذف جميع السحوبات الخاصة بموظف معين
} = require('../controllers/withdrawalController'); // استيراد الدوال من وحدة التحكم

const router = express.Router(); // إنشاء راوتر جديد

// Route لإنشاء سحب جديد
// الطلب: POST /api/withdrawals
// المدخلات: body يحتوي على employee, material, quantity, note
// المخرج: رسالة نجاح وبيانات السحب الجديد
router.post('/', createWithdrawal);

// Route لتحديث سحب موجود
// الطلب: PUT /api/withdrawals/:withdrawalId
// المدخلات: params يحتوي على withdrawalId, body يحتوي على employee, material, quantity, note
// المخرج: رسالة نجاح وبيانات السحب المحدث
router.put('/:withdrawalId', updateWithdrawal);

// Route لجلب جميع السحوبات مجمعة حسب الموظف
// الطلب: GET /api/withdrawals
// المدخلات: لا توجد
// المخرج: قائمة بالسحوبات مجمعة حسب الموظف
router.get('/', getWithdrawalsGroupedByEmployee);

// Route لجلب سحب بواسطة ID
// الطلب: GET /api/withdrawals/:withdrawalId
// المدخلات: params يحتوي على withdrawalId
// المخرج: بيانات السحب بواسطة ID
router.get('/:withdrawalId', getWithdrawalById);

// Route لحذف سحب
// الطلب: DELETE /api/withdrawals/:withdrawalId
// المدخلات: params يحتوي على withdrawalId
// المخرج: رسالة نجاح عند الحذف
router.delete('/:withdrawalId', deleteWithdrawal);

// Route لحذف جميع السحوبات الخاصة بموظف معين
// الطلب: DELETE /api/withdrawals/employee/:employeeId
// المدخلات: params يحتوي على employeeId
// المخرج: رسالة نجاح عند حذف جميع السحوبات الخاصة بالموظف
router.delete('/employee/:employeeId', deleteWithdrawalsByEmployeeId);

module.exports = router; // تصدير الراوتر لاستخدامه في التطبيق
