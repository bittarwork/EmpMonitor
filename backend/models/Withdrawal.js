const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    quantity: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now },
    note: { type: String },
    totalPrice: { type: Number, required: true }
});

withdrawalSchema.pre('save', async function (next) {
    try {
        const Material = require('./Material');
        const material = await Material.findById(this.material);

        if (!material) {
            throw new Error('Material not found');
        }

        this.totalPrice = this.quantity * material.price;
        next();
    } catch (error) {
        next(error);
    }
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
