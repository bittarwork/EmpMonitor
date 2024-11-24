const express = require('express');
const router = express.Router();
const { getAllSalaries, updateSalary } = require('../controllers/SalaryController');

// Route to fetch all salaries with employee and withdrawal details
router.get('/salaries', getAllSalaries);
router.put('/update/:id', updateSalary);

module.exports = router;
