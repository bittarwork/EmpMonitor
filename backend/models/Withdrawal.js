// models/Withdrawal.js
const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    quantity: { type: Number, required: true, min: 1 }, // التأكد من أن الكمية أكبر من صفر
    date: { type: Date, default: Date.now },
    note: { type: String },
    totalPrice: { type: Number, required: true }
});

// يمكن إضافة طريقة لحساب totalPrice بناءً على سعر المادة
withdrawalSchema.pre('save', async function (next) {
    try {
        const Material = require('./Material'); // التأكد من استيراد النموذج
        const material = await Material.findById(this.material);

        if (!material) {
            throw new Error('Material not found');
        }

        this.totalPrice = this.quantity * material.price; // افترض أن السعر موجود في نموذج Material
        next();
    } catch (error) {
        next(error);
    }
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
