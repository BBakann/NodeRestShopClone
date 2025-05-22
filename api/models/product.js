const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    imageUrl: { type: String, required: false } // resim zorunlu değil
 
});

module.exports = mongoose.model('Product',productSchema);