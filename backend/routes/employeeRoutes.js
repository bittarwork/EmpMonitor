const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// مسارات الموظفين

// POST /api/employees - إنشاء موظف مع رفع صورة
router.post('/', employeeController.uploadImage, employeeController.createEmployee);

// PUT /api/employees/:id - تحديث موظف مع رفع صورة
router.put('/:id', employeeController.uploadImage, employeeController.updateEmployee);

// GET /api/employees - جلب جميع الموظفين
router.get('/', employeeController.getEmployees);

// GET /api/employees/:id - جلب موظف بواسطة ID
router.get('/:id', employeeController.getEmployeeById);

// DELETE /api/employees/:id - حذف موظف
router.delete('/:id', employeeController.deleteEmployee);

// GET /api/employees/hirePeriod - جلب الموظفين الذين تم تعيينهم في فترة معينة
router.get('/hirePeriod', employeeController.getEmployeesByHirePeriod);

// GET /api/employees/:id/salary - حساب الراتب الأسبوعي للموظف
router.get('/:id/salary', employeeController.calculateWeeklySalary);

module.exports = router;
