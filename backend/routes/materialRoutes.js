const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/MaterialController');

// راوت لإنشاء مادة جديدة
router.post('/', MaterialController.createMaterial);

// راوت لتحديث بيانات مادة بواسطة ID
router.put('/:id', MaterialController.updateMaterial);

// راوت لجلب جميع المواد
router.get('/', MaterialController.getMaterials);

// راوت لجلب مادة بواسطة ID
router.get('/:id', MaterialController.getMaterialById);

// راوت لحذف مادة بواسطة ID
router.delete('/:id', MaterialController.deleteMaterial);

// راوت للبحث عن مواد بواسطة اسم المادة
router.get('/search', MaterialController.searchMaterialsByName);

module.exports = router;
