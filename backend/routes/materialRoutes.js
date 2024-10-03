const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController.js');

// تعريف الراوتات
router.get('/', materialController.getAllMaterials);
router.post('/', materialController.createMaterial);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;
