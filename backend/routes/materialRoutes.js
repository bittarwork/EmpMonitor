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


module.exports = router;

// REACT_APP_API_URL = http://localhost:5000/api
// GET: http://localhost:5000/api/materials
// [
//     {
//         "_id": "6704451f7b96f70c998176da",
//         "name": "بوظة",
//         "price": 125,
//         "quantity": 2352,
//         "__v": 0
//     },
//     {
//         "_id": "670445a97b96f70c9981ff3a",
//         "name": "شوكولا ",
//         "price": 152000,
//         "quantity": 3260,
//         "__v": 0
//     },
//     {
//         "_id": "670445b77b96f70c998219db",
//         "name": "سطل خرا ",
//         "price": 152680,
//         "quantity": 1325,
//         "__v": 0
//     },
//     {
//         "_id": "670689365d570c557c976d0f",
//         "name": "بسكويت ويفر محشي ",
//         "price": 13536,
//         "quantity": 15685,
//         "__v": 0
//     },
//     {
//         "_id": "670689465d570c557c977d31",
//         "name": "بسكوت محشي ",
//         "price": 12982,
//         "quantity": 135656,
//         "__v": 0
//     },
//     {
//         "_id": "670689535d570c557c978828",
//         "name": "علبة لبنة",
//         "price": 19800,
//         "quantity": 19800,
//         "__v": 0
//     }
// ]
// GET: http://localhost:5000/api/materials/670445b77b96f70c998219db
// {
//     "_id": "670445b77b96f70c998219db",
//         "name": "سطل خرا ",
//             "price": 152680,
//                 "quantity": 1325,
//                     "__v": 0
// }
// POST: http://localhost:5000/api/materials
// {
//     "name": "كاتو قطع",
//         "price": 1359622,
//             "quantity": 1234
// }
// res:
// {
//     "message": "Material created successfully",
//         "material": {
//         "name": "كاتو قطع",
//             "price": 1359622,
//                 "quantity": 1234,
//                     "_id": "6709721a78a6e599528acbe3",
//                         "__v": 0
//     }
// }
// PUT: http://localhost:5000/api/materials/6709721a78a6e599528acbe3
// {
//     "name": "كاتو قطع",
//         "price": 132569,
//             "quantity": 1234
// }
// res:
// {
//     "message": "Material updated successfully",
//         "material": {
//         "_id": "6709721a78a6e599528acbe3",
//             "name": "كاتو قطع",
//                 "price": 132569,
//                     "quantity": 1234,
//                         "__v": 0
//     }
// }
// DELETE: http://localhost:5000/api/materials/6709721a78a6e599528acbe3
// res:
// {
//     "message": "Material deleted successfully"
// }