const mongoose = require('mongoose');
// const product = require('../models/product');

const Product = require('../models/product');



const allProduct = (req, res, next) => {
    Product.find()
            .select('name price _id productImage')
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return{
                            name: doc.name,
                            price: doc.price,
                            productImage: doc.productImage,
                            id: doc._id,
                            request: {
                                type: "GET",
                                url: "http://localhost:3000/products/"+ doc._id
                            }
                        }
                    })
                };
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
}

const creatProduct = (req, res, next) => {
    console.log(req.file);
    const product = new Product ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result)
        res.status(200).json({
            message: 'product created successfully',
            CreatedProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/"+ result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
    
}


const oneProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
            .select('_id name price productImage')
            .exec()
            .then(doc => {
                console.log(doc);
                if(doc){
                    res.status(200).json({
                        product: {
                            name: doc.name,
                            price: doc.price,
                            productImage: doc.productImage,
                            Id: doc._id
                        },
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/",
                            description: "Request to get all products"
                        }
                    });
                }else{
                    res.status(404).json({
                        message: 'no valid entry found for ID pased'
                    });
                }
                
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
}


const updateProduct = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, {$set: updateOps})
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: "product updated successfuly",
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/"+ id,
                        description: "Request to get the updated product"
                    } 
                });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            });
}


const deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'product deleted successfully',
                    request: {
                        type: "POST",
                        url: "http://localhost:3000/products/",
                        body: {
                            name: 'String',
                            price: 'Number'
                        },
                        description: "Request to add new product"
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}

module.exports = {allProduct, oneProduct, creatProduct, updateProduct, deleteProduct}