const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// تسجيل مستخدم جديد
// http://localhost:5000/api/users/register
// response : 
// {
//     "message": "تم تسجيل المستخدم بنجاح",
//         "userId": "670aafa4757565c1f69b52c8"
// }
router.post('/register', userController.uploadImage, userController.registerUser);

// تسجيل الدخول
// http://localhost:5000/api/users/login
// {
//     "email": "ahmad@gmail.com",
//         "password": "123321123321"
// }
// response:
// {
//     "message": "تم تسجيل الدخول بنجاح",
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGFhZmE0NzU3NTY1YzFmNjliNTJjOCIsImlhdCI6MTcyODc1MzYxNCwiZXhwIjoxNzI4NzU3MjE0fQ._nLphpr1RcARVeAMuwwpNvcd0-tGGNt-f9Hnm276ufU",
//             "user": {
//         "id": "670aafa4757565c1f69b52c8",
//             "username": "ahmadove",
//                 "firstName": "ahmad",
//                     "lastName": "lahham",
//                         "phone": "0096393273560612",
//                             "email": "ahmad@gmail.com",
//                                 "image": "http://localhost:5000/uploads\\profileImage-1728753572307-790100563.jpeg"
//     }
// }
router.post('/login', userController.loginUser);

// 3. مسار تحديث الملف الشخصي للمستخدم
// http://localhost:5000/api/users/profile/670aafa4757565c1f69b52c8
// الجسم(Body): اختر "form-data" وأضف الحقول التالية:

// firstName: الاسم الأول
// lastName: الاسم الأخير
// phone: رقم الهاتف
// profileImage: صورة(اختياري)
// response : 
// {
//     "message": "تم تحديث الملف الشخصي بنجاح",
//         "user": {
//         "_id": "670aafa4757565c1f69b52c8",
//             "username": "ahmadove",
//                 "firstName": "hammoudeh",
//                     "lastName": "lahham",
//                         "phone": "0096393273560612",
//                             "email": "ahmad@gmail.com",
//                                 "profileImage": "uploads\\profileImage-1728753572307-790100563.jpeg",
//                                     "__v": 0
//     }
// }
router.put('/profile/:id', userController.uploadImage, userController.updateUserProfile);

// 4. مسار تحديث كلمة المرور للمستخدم
// http://localhost:5000/api/users/password/670aafa4757565c1f69b52c8
// {
//     "currentPassword": "123321123321",
//         "newPassword": "123321123321"
// }
// response : 
// {
//     "message": "تم تحديث كلمة المرور بنجاح"
// }
router.put('/password/:id', userController.updatePassword);

// 5. مسار الحصول على بيانات المستخدم بواسطة معرف المستخدم
// http://localhost:5000/api/users/670aafa4757565c1f69b52c8
// response : 
// {
//     "_id": "670aafa4757565c1f69b52c8",
//         "username": "ahmadove",
//             "firstName": "hammoudeh",
//                 "lastName": "lahham",
//                     "phone": "0096393273560612",
//                         "email": "ahmad@gmail.com",
//                             "profileImage": "uploads\\profileImage-1728753572307-790100563.jpeg",
//                                 "__v": 0
// }
router.get('/:id', userController.getUserById);

module.exports = router;
