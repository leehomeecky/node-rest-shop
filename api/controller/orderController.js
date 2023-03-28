const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

const allOrder = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate("product", "name _id")
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                quantity: docs.length,
                Orders: docs.map(doc =>{
                    return {
                        id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,

                        request: {
                            type: "GET",
                            url: "http://locahost:3000/orders/" + doc._id,
                            description: "get all info about this perticular product"
                        }
                    } 

                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


const creatOrder = (req, res, next) => {
    Product.findById(req.body.productId)
            .then(product => {
                if(!product){
                    return res.status(404).json({
                        message: "product not found"
                    });
                }
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    product: req.body.productId,
                    quantity: req.body.quantity
                });
                return order.save()
                    
            })
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "order crated successfuly",
                    createdOrder: {
                        product: result.product,
                        quantity: result.quantity,
                        id: result._id
                    },
                    request: {
                        type: "GET",
                        url: "http://locahost:3000/orders",
                        description: "get all stored orders"
                    }
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    
}


const oneOder = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('_id product quantity')
        .populate("product", "name _id price")
        .exec()
        .then(doc => {
            if(!doc){
                return res.status(404).json({
                    message: "order not found"
                })
            }
            res.status(200).json({
                order: doc,
                request: {
                    type: "GET",
                    url: "http://locahost:3000/orders",
                    description: "get all stored orders"
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


const deleteOrder = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'order deleted successfully',
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders/",
                    body: {
                        product: 'Object Id',
                        quantity: 'Number'
                    },
                    description: "Request to add new order"
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

module.exports = {
                allOrder,
                creatOrder,
                oneOder,
                deleteOrder
                };