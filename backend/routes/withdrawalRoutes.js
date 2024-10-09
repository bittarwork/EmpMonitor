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
// مثال على المدخلات:
// {
//     "employee": "6703d79915aa3abb03d2ae7e",
//     "material": "670445b77b96f70c998219db",
//     "quantity": 2,
//     "note": "This is a test withdrawal"
// }
// المخرج: رسالة نجاح وبيانات السحب الجديد
// مثال على المخرج:
// {
//     "message": "Withdrawal created successfully",
//     "withdrawal": {
//         "employee": "6703d79915aa3abb03d2ae7e",
//         "material": "670445b77b96f70c998219db",
//         "quantity": 2,
//         "note": "This is a test withdrawal",
//         "_id": "6706fcd2929f2ea71f4bc9d2",
//         "date": "2024-10-09T21:59:46.673Z",
//         "__v": 0
//     }
// }
router.post('/', createWithdrawal);

// Route لتحديث سحب موجود
// الطلب: PUT /api/withdrawals/:withdrawalId
// المدخلات: params يحتوي على withdrawalId, body يحتوي على employee, material, quantity, note
// مثال على المدخلات:
// {
//     "material": "670445a97b96f70c9981ff3a",
//     "quantity": 5,
//     "note": "This is a test withdrawal"
// }
// المخرج: رسالة نجاح وبيانات السحب المحدث
// مثال على المخرج:
// {
//     "message": "Withdrawal updated successfully",
//     "withdrawal": {
//         "_id": "67068cb25d570c557c98c440",
//         "employee": "6703d46142225f0ef7bbb5bc",
//         "material": "670445a97b96f70c9981ff3a",
//         "quantity": 5,
//         "note": "This is a test withdrawal",
//         "date": "2024-10-09T14:01:22.117Z",
//         "__v": 0
//     }
// }
router.put('/:id', updateWithdrawal);

// Route لجلب جميع السحوبات مجمعة حسب الموظف
// الطلب: GET /api/withdrawals
// المدخلات: لا توجد
// المخرج: قائمة بالسحوبات مجمعة حسب الموظف
// مثال على المخرج:
// [
//     {
//         "withdrawals": [...],
//         "employeeId": "6703d46142225f0ef7bbb5bc"
//     },
//     {
//         "withdrawals": [...],
//         "employeeId": "6703d79915aa3abb03d2ae7e"
//     }
// ]
router.get('/', getWithdrawalsGroupedByEmployee);

// Route لجلب سحب بواسطة ID
// الطلب: GET /api/withdrawals/:withdrawalId
// المدخلات: params يحتوي على withdrawalId
// مثال على المدخلات: "67068cb25d570c557c98c440"
// المخرج: بيانات السحب بواسطة ID
// مثال على المخرج:
// {
//     "_id": "67068cb25d570c557c98c440",
//     "employee": {...}, // بيانات الموظف
//     "material": {...}, // بيانات المادة
//     "quantity": 5,
//     "note": "This is a test withdrawal",
//     "date": "2024-10-09T14:01:22.117Z",
//     "__v": 0
// }
router.get('/:withdrawalId', getWithdrawalById);

// Route لحذف سحب
// الطلب: DELETE /api/withdrawals/:withdrawalId
// المدخلات: params يحتوي على withdrawalId
// مثال على المدخلات: "67068cb25d570c557c98c440"
// المخرج: رسالة نجاح عند الحذف
// مثال على المخرج:
// {
//     "message": "Withdrawal deleted successfully"
// }
router.delete('/:withdrawalId', deleteWithdrawal);

// Route لحذف جميع السحوبات الخاصة بموظف معين
// الطلب: DELETE /api/withdrawals/employee/:employeeId
// المدخلات: params يحتوي على employeeId
// مثال على المدخلات: "6703d79915aa3abb03d2ae7e"
// المخرج: رسالة نجاح عند حذف جميع السحوبات الخاصة بالموظف
// مثال على المخرج:
// {
//     "message": "تم حذف جميع السحوبات بنجاح."
// }
router.delete('/employee/:employeeId', deleteWithdrawalsByEmployeeId);

module.exports = router; // تصدير الراوتر لاستخدامه في التطبيق
