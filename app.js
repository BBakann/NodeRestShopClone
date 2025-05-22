const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
  'mongodb+srv://berdanbakan2:' + process.env.MONGO_ATLAS_PW + '@node-api-shop.p9m0jfc.mongodb.net/?retryWrites=true&w=majority&appName=node-api-shop',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));


app.use(morgan('dev'));
app.use(express.urlencoded({extended:false})); // body-parser  
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));



app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req,res,next) => {
    const error = new Error('Not Found!');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;