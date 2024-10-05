// controllers/userController.js
const User = require('../models/User');

// 1. تسجيل مستخدم جديد
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. تسجيل الدخول
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = user.generateAuthToken();

        // إضافة معلومات المستخدم إلى الاستجابة
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
                // يمكنك إضافة المزيد من المعلومات هنا إذا لزم الأمر
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. الحصول على معلومات المستخدم
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // لا ترجع كلمة المرور
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
