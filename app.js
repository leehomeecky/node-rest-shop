const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// connect to mongodb;
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://root:'+ process.env.MONGO_DOCKER_PW +'@localhost:27017/node-rest-shop?authSource=admin',{
    useNewUrlParser: true
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methos', 'PUT, POST, PATH, DELETE, GET');
        return res.status(200).json({});
    };
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app