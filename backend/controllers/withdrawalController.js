const Withdrawal = require('../models/Withdrawal');
const Employee = require('../models/Employee');
const Material = require('../models/Material');
const mongoose = require('mongoose');

// دالة لإنشاء سحب جديد
exports.createWithdrawal = async (req, res) => {
    try {
        const { employee, material, quantity, note } = req.body;

        // تحقق من وجود البيانات المطلوبة
        if (!employee || !material || !quantity) {
            return res.status(400).json({ message: 'Employee, material, and quantity are required.' });
        }

        // تحقق من وجود الموظف
        const foundEmployee = await Employee.findById(employee);
        if (!foundEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // تحقق من وجود المادة
        const foundMaterial = await Material.findById(material);
        if (!foundMaterial) {
            return res.status(404).json({ message: 'Material not found' });
        }

        const withdrawalData = {
            employee,
            material,
            quantity,
            note
        };

        const withdrawal = new Withdrawal(withdrawalData);
        await withdrawal.save();
        res.status(201).json({ message: 'Withdrawal created successfully', withdrawal });
    } catch (error) {
        console.error('Error creating withdrawal:', error);
        res.status(500).json({ message: 'Error creating withdrawal', error });
    }
};
exports.updateWithdrawal = async (req, res) => {
    try {
        const { material, quantity, note } = req.body; // إزالة employee من المدخلات
        const { id } = req.params;

        console.log('ID received:', id); // طباعة المعرف المستلم

        // التحقق من صحة معرفات ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid withdrawal ID' });
        }

        if (!mongoose.Types.ObjectId.isValid(material)) {
            return res.status(400).json({ message: 'Invalid material ID' });
        }

        // التحقق من وجود البيانات المطلوبة
        if (!material || typeof quantity !== 'number') {
            return res.status(400).json({ message: 'Material and quantity are required.' });
        }

        // تحقق من وجود السحب
        const foundWithdrawal = await Withdrawal.findById(id);
        if (!foundWithdrawal) {
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        // تحقق من وجود المادة
        const foundMaterial = await Material.findById(material);
        if (!foundMaterial) {
            return res.status(404).json({ message: 'Material not found' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than zero' });
        }

        // تحديث المادة، الكمية والملاحظة فقط
        foundWithdrawal.material = material;
        foundWithdrawal.quantity = quantity;
        foundWithdrawal.note = note;

        await foundWithdrawal.save();
        res.status(200).json({ message: 'Withdrawal updated successfully', withdrawal: foundWithdrawal });
    } catch (error) {
        console.error('Error updating withdrawal:', error);
        res.status(500).json({ message: 'Error updating withdrawal', error });
    }
};


// دالة لجلب جميع السحوبات مجمعة حسب الموظف
exports.getWithdrawalsGroupedByEmployee = async (req, res) => {
    try {
        const groupedWithdrawals = await Withdrawal.aggregate([
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employeeInfo'
                }
            },
            { $unwind: '$employeeInfo' },
            {
                $lookup: {
                    from: 'materials',
                    localField: 'material',
                    foreignField: '_id',
                    as: 'materialInfo'
                }
            },
            { $unwind: '$materialInfo' },
            {
                $group: {
                    _id: '$employee', // تجمع السجلات حسب ID الموظف
                    withdrawals: {
                        $push: {
                            withdrawalId: '$_id',
                            materialName: '$materialInfo.name',
                            materialPrice: '$materialInfo.price',
                            quantity: '$quantity',
                            date: '$date',
                            note: '$note'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: '$_id', // الاحتفاظ بالـ ID الخاص بالموظف فقط
                    withdrawals: 1 // الاحتفاظ بقائمة السحوبات
                }
            }
        ]);

        res.status(200).json(groupedWithdrawals);
    } catch (error) {
        console.error('Error fetching withdrawals grouped by employee:', error);
        res.status(500).json({ message: 'Error fetching withdrawals grouped by employee', error });
    }
};


// دالة لجلب سحب بواسطة ID
exports.getWithdrawalById = async (req, res) => {
    try {
        const { withdrawalId } = req.params; // استخدم withdrawalId هنا
        if (!mongoose.Types.ObjectId.isValid(withdrawalId)) {
            return res.status(400).json({ message: 'Invalid withdrawal ID' });
        }

        const withdrawal = await Withdrawal.findById(withdrawalId).populate('employee').populate('material');
        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        res.status(200).json(withdrawal);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching withdrawal by ID', error });
    }
};


// دالة لحذف سحب
exports.deleteWithdrawal = async (req, res) => {
    try {
        const { withdrawalId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(withdrawalId)) {
            return res.status(400).json({ message: 'Invalid withdrawal ID' });
        }

        const withdrawal = await Withdrawal.findByIdAndDelete(withdrawalId);
        if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

        res.status(200).json({ message: 'Withdrawal deleted successfully' });
    } catch (error) {
        console.error('Error deleting withdrawal:', error);
        res.status(500).json({ message: 'Error deleting withdrawal', error });
    }
};

// دالة لحذف جميع السحوبات الخاصة بموظف معين
exports.deleteWithdrawalsByEmployeeId = async (req, res) => {
    const { employeeId } = req.params; // استرجاع الـ ID الخاص بالموظف من معلمات الطلب

    try {
        const result = await Withdrawal.deleteMany({ employee: employeeId }); // حذف جميع السحوبات الخاصة بالموظف

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'لا توجد سحوبات لهذا الموظف.' });
        }

        res.status(200).json({ message: 'تم حذف جميع السحوبات بنجاح.' });
    } catch (error) {
        console.error('Error deleting withdrawals:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء حذف السحوبات', error });
    }
};
// دالة لجلب المسحوبات الخاصة بموظف معين
exports.getWithdrawalsByEmployeeId = async (req, res) => {
    const employeeId = req.params.id; // الحصول على id الموظف من باراميتر الرابط

    try {
        const withdrawals = await Withdrawal.find({ employee: employeeId }).populate('material'); // استخدم populate لجلب تفاصيل المادة
        if (withdrawals.length === 0) {
            return res.status(404).json({ message: 'لا توجد مسحوبات لهذا الموظف' });
        }
        return res.status(200).json(withdrawals); // إعادة المسحوبات
    } catch (error) {
        return res.status(500).json({ message: 'حدث خطأ أثناء استرجاع المسحوبات', error: error.message });
    }
};