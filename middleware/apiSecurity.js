const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {

    requireLogin: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        const token = authHeader.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token expired' });
                }
                return res.status(401).json({ message: 'Invalid session or token' });
            }
            req.user = decoded;
            next(); 
        });
    }

}
