const jwt = require('jsonwebtoken');

// Authentication kontrolü yapan middleware
module.exports = (req, res, next) => {
    try {
        // Authorization header'ından token'ı al
        
        const token = req.headers.authorization.split(" ")[1]; // "Bearer" kelimesini çıkart
        
        // Token'ı doğrula ve decode et
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        
        // Decode edilen bilgileri req.userData'ya ekle
        // Böylece sonraki middleware'ler ve route'lar bu bilgiyi kullanabilir
        req.userData = decoded;
        
        // Sonraki middleware'e geç
        next();
    } catch (error) {
        // Token geçersiz ise 401 Unauthorized dön
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
}; 