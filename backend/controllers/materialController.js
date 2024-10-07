const Material = require('../models/Material');

// دالة لإنشاء مادة جديدة
exports.createMaterial = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        // تحقق من وجود البيانات المطلوبة
        if (!name || !price || !quantity) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // تحقق من صحة السعر والكمية
        if (price < 0 || quantity < 0) {
            return res.status(400).json({ message: 'Price and quantity must be non-negative.' });
        }

        const material = new Material({ name, price, quantity });
        await material.save();
        res.status(201).json({ message: 'Material created successfully', material });
    } catch (error) {
        console.error('Error creating material:', error);
        res.status(500).json({ message: 'Error creating material', error });
    }
};

// دالة لتحديث بيانات مادة
exports.updateMaterial = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        // تحقق من وجود البيانات المطلوبة
        if (!name && price === undefined && quantity === undefined) {
            return res.status(400).json({ message: 'At least one field is required to update.' });
        }

        // تحقق من صحة السعر والكمية
        if (price < 0 || quantity < 0) {
            return res.status(400).json({ message: 'Price and quantity must be non-negative.' });
        }

        const material = await Material.findByIdAndUpdate(req.params.id, { name, price, quantity }, { new: true });
        if (!material) return res.status(404).json({ message: 'Material not found' });
        res.status(200).json({ message: 'Material updated successfully', material });
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({ message: 'Error updating material', error });
    }
};

// دالة لجلب جميع المواد
exports.getMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ message: 'Error fetching materials', error });
    }
};

// دالة لجلب مادة بواسطة ID
exports.getMaterialById = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });
        res.status(200).json(material);
    } catch (error) {
        console.error('Error fetching material:', error);
        res.status(500).json({ message: 'Error fetching material', error });
    }
};

// دالة لحذف مادة
exports.deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndDelete(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });
        res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ message: 'Error deleting material', error });
    }
};

// دالة للبحث عن مواد بواسطة اسم المادة
exports.searchMaterialsByName = async (req, res) => {
    try {
        const { name } = req.query;

        // تحقق من وجود الاسم
        if (!name) {
            return res.status(400).json({ message: 'Name query parameter is required.' });
        }

        const materials = await Material.find({ name: new RegExp(name, 'i') }); // البحث غير حساس لحالة الأحرف
        res.status(200).json(materials);
    } catch (error) {
        console.error('Error searching materials:', error);
        res.status(500).json({ message: 'Error searching materials', error });
    }
};



