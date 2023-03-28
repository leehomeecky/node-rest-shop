const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const {
    allOrder,
    creatOrder,
    oneOder,
    deleteOrder 
    } = require('../controller/orderController');


router.get('/', checkAuth, allOrder);
router.post('/', checkAuth, creatOrder);
router.get('/:orderId', checkAuth, oneOder)
router.delete('/:orderId', checkAuth, deleteOrder);

module.exports = router