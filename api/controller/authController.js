const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const signup = (req, res, next) => {

    User.find({email: req.body.email})
        .exec()
        .then(result => {
            if(result.length > 0){
                res.status(409).json({
                    message: "Mail already exist before"
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'user created successfully',
                                    user: user
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        })
        .catch()
    
}


const login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(users => {
            if(users === null){
                res.status(401).json({
                    message: "Auth failed"
                });
            }else{
             bcrypt.compare(req.body.password, users.password, (err, result) => {
                if(err){
                    res.status(401).json({
                        message: "Auth failed"
                    })
                }else if(result){
                    const token = jwt.sign({
                        email: users.email,
                        userId: users._id
                    }, 
                    process.env.JWT_Key,
                    {
                        expiresIn: "1h"
                    },

                    )
                    res.status(200).json({
                        message: "Auth Successfull",
                        token: token
                    })
                }else{
                    res.status(401).json({
                        message: "Auth failed"
                    })
                }
             });   
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}


module.exports = {signup, login}