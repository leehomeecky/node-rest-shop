const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require("multer");
const { 
    oneProduct,
    allProduct,
    creatProduct,
    updateProduct,
    deleteProduct
 } = require('../controller/productController');


const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false)
    }
    cb(null, false)
    
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024* 5
    },
    fileFilter: fileFilter
});

router.get('/', allProduct);
router.post('/', checkAuth, upload.single('productImage'), creatProduct);
router.get('/:productId', oneProduct)
router.patch('/:productId', checkAuth, updateProduct);
router.delete('/:productId', checkAuth, deleteProduct);

module.exports = router