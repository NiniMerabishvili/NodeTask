const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to where your User model is located
require('dotenv').config(); // Load environment variables from a .env file

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('JWT_SECRET is missing in .env file');
    process.exit(1); // Exit if the secret is not found
}

const authenticateUser = async (req, res, next) => {
    try {
        // Look for the token in the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication token is missing' });
        }

        // Decode the token and verify it
        let decoded;
        try {
            decoded = jwt.verify(token, jwtSecret); // Use your actual JWT secret here
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Find the user associated with the token
        const user = await User.findByPk(decoded.id); // Ensure you're saving the user's id in the JWT payload

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Save the user in the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error);

        // If the error is from the User model, it might be a validation issue.
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error: ' + error.errors.map(e => e.message).join(', ') });
        }

        // General fallback for other types of errors
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticateUser;
