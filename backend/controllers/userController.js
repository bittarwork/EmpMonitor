const User = require('../models/User');
const multer = require('multer');

// إعداد Multer لتخزين الملفات المرفوعة
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // مجلد حفظ الصور
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
});

// إعداد خيارات Multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // التحقق من نوع الملف
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('الملف يجب أن يكون صورة'));
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 } // الحد الأقصى لحجم الصورة 2MB
});

// تحميل صورة واحدة
exports.uploadImage = upload.single('profileImage');

// 1. تسجيل مستخدم جديد
exports.registerUser = async (req, res) => {
    try {
        const { username, firstName, lastName, phone, email, password } = req.body;
        const profileImage = req.file ? req.file.path : undefined;

        // تحقق من وجود المستخدم باستخدام البريد الإلكتروني أو رقم الهاتف
        const existingUser = await User.findOne({
            $or: [
                { email },
                { phone }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'البريد الإلكتروني أو الرقم موجود بالفعل. يرجى استخدام بيانات مختلفة.' });
        }

        // إنشاء مستخدم جديد
        const newUser = new User({
            username,
            firstName,
            lastName,
            phone,
            email,
            password,
            profileImage // إضافة مسار الصورة
        });

        await newUser.save();
        res.status(201).json({ message: 'تم تسجيل المستخدم بنجاح', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في التسجيل', error: error.message });
    }
};

// 2. تسجيل الدخول
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // التحقق من وجود المستخدم
        if (!user) {
            return res.status(401).json({ message: 'بيانات الاعتماد غير صحيحة' });
        }

        // التحقق من كلمة المرور
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'بيانات الاعتماد غير صحيحة' });
        }

        // توليد رمز التوثيق
        const token = user.generateAuthToken();

        // بناء مسار الصورة
        const imageUrl = user.profileImage ? `${req.protocol}://${req.get('host')}/${user.profileImage}` : null;

        // إرجاع معلومات المستخدم بالتفصيل
        res.json({
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                image: imageUrl, // إضافة مسار الصورة إلى الاستجابة
                createdAt: user.createdAt, // تاريخ الإنشاء (إذا كان موجودًا في النموذج)
                updatedAt: user.updatedAt // تاريخ التحديث (إذا كان موجودًا في النموذج)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 3. الحصول على معلومات المستخدم

exports.getUserProfile = async (req, res) => {
    const userId = req.params.id; // استخدم معرف المستخدم المرسل في الطلب
    try {
        const user = await User.findById(userId).select('-password'); // لا ترجع كلمة المرور
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// 4. الحصول على مستخدم حسب ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password'); // لا ترجع كلمة المرور
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. تحديث الملف الشخصي للمستخدم الحالي
exports.updateUserProfile = async (req, res) => {
    const userId = req.params.id; // استخدم معرف المستخدم المرسل في الطلب
    try {
        const { firstName, lastName, phone } = req.body;
        const profileImage = req.file ? req.file.path : undefined;

        const updateData = { firstName, lastName, phone };
        if (profileImage) {
            updateData.profileImage = profileImage;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        res.json({ message: 'تم تحديث الملف الشخصي بنجاح', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 6. تحديث كلمة المرور
exports.updatePassword = async (req, res) => {
    const userId = req.params.id; // استخدم معرف المستخدم المرسل في الطلب
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId); // ابحث عن المستخدم باستخدام المعرف

        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'كلمة المرور الحالية غير صحيحة' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'تم تحديث كلمة المرور بنجاح' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

