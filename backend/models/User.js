// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// دالة لتشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// دالة للتحقق من كلمة المرور
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// دالة لتوليد التوكن
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
