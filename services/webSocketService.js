const { Server } = require('socket.io');
const authenticateSocket = require('../middleware/authenticateSocket');
const { sequelize } = require('../models'); // Assuming Sequelize models are here

let io;

// Initialize WebSocket server
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Send a message from one user to another
    socket.on('sendMessage', async (data) => {
        const { recipientId, message } = data;
        const senderId = socket.user.id;

        try {
            console.log('Saving message:', { senderId, recipientId, message });

            // Attempt to save the message to the database
            const newMessage = await sequelize.models.Message.create({
                senderId,
                recipientId,
                message,
            });

            console.log('Message saved:', newMessage);

            // Emit the message to the recipient
            const recipientSocket = io.sockets.sockets.get(recipientId);
            if (recipientSocket) {
                recipientSocket.emit('newMessage', newMessage);
            } else {
                console.log(`Recipient ${recipientId} not connected`);
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                console.error('Validation error:', error.errors);  // Handles validation errors from Sequelize
            } else {
                console.error('Error saving message:', error);  // Handles general errors
            }
        }
    });




    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.username}`);
    });
});


module.exports = { setupWebSocket };
