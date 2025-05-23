const mongoose = require('mongoose');
const bcrypt = require('bcrypt');           // Şifre hash'leme için
const jwt = require('jsonwebtoken');        // JWT token oluşturma için
const User = require('../models/user');     // User modeli

// KULLANICI KAYIT CONTROLLER
exports.user_signup = (req, res, next) => {
    // Önce aynı email'le kayıtlı kullanıcı var mı kontrol et
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            // Eğer kullanıcı bulundu ise (array length >= 1)
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                // Kullanıcı yoksa şifreyi hash'le
                // 10: salt rounds (ne kadar güçlü hash)
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        // Yeni kullanıcı oluştur
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),    // Yeni ObjectId
                            email: req.body.email,                 // Email
                            password: hash                          // Hash'lenmiş şifre
                        });
                        
                        // Veritabanına kaydet
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
};

// KULLANICI GİRİŞ CONTROLLER
exports.user_login = (req, res, next) => {
    // Debug: JWT_KEY kontrol
    console.log('JWT_KEY:', process.env.JWT_KEY);
    
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                
                if (result) {
                    // JWT Key yoksa manuel set et
                    const jwtKey = process.env.JWT_KEY || 'fallback_secret_key_for_development';
                    
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        jwtKey,
                        {
                            expiresIn: "1h"
                        }
                    );
                    
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// KULLANICI SİLME CONTROLLER
exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}; 