const Material = require('../models/Material');

// الحصول على جميع المواد
exports.getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// إضافة مادة جديدة
exports.createMaterial = async (req, res) => {
    const material = new Material(req.body);
    try {
        const savedMaterial = await material.save();
        res.status(201).json(savedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// تحديث مادة
exports.updateMaterial = async (req, res) => {
    try {
        const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// حذف مادة
exports.deleteMaterial = async (req, res) => {
    try {
        await Material.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
