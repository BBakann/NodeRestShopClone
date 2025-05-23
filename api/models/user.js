const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    email: { 
        type: String,           
        required: true,         
        unique: true,          // Veritabanında tekil olmalı (aynı email 2 kez olamaz)
        // Email formatını kontrol eden regex
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    
     //hash'lenmiş olarak saklanacak)
    password: { 
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('User', userSchema);