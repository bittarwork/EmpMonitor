// routes/withdrawalRoutes.js
const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

router.get('/', withdrawalController.getAllWithdrawals);
router.post('/', withdrawalController.createWithdrawal);
router.put('/:id', withdrawalController.updateWithdrawal);
router.delete('/:id', withdrawalController.deleteWithdrawal);

module.exports = router;
