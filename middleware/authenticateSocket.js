const jwt = require('jsonwebtoken');

module.exports = (socket, next) => {
    const token = socket.handshake.query.token; // JWT sent with connection request
    if (!token) {
        return next(new Error('Authentication token is missing'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Attach user info to socket
        next();
    } catch (error) {
        return next(new Error('Invalid or expired token'));
    }
};
