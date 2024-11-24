const express = require('express');
const router = express.Router();
const { getAllSalaries, updateSalary, paySalary } = require('../controllers/SalaryController');

router.get('/salaries', getAllSalaries);

router.put('/update/:id', updateSalary);

router.put('/pay', paySalary);


module.exports = router;
