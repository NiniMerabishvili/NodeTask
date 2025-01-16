// Import dependencies
const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');
const WebSocket = require('ws'); // Import WebSocket from 'ws'
const { Client } = require('pg');
require('dotenv').config();
const User = require('./models/user');
const Follow = require('./models/follow');
const Message = require('./models/message');
const sequelize = require('./config/database');

const app = express();
const port = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app); // (1)

// Create WebSocket server
const wss = new WebSocket.Server({ server: server }); // Use the server instance, not the http module

const users = new Map(); // Maps userId to WebSocket connection

wss.on('connection', (ws, req) => {
    console.log('A user connected');

    // Extract token from the URL
    const token = req.url.split('token=')[1];
    if (!token) {
        ws.send(JSON.stringify({ error: 'Token missing in connection URL' }));
        return ws.close();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Save the connection
        ws.userId = userId;
        users.set(userId, ws);

        console.log(`User ${userId} connected`);
    } catch (error) {
        console.error('Invalid token:', error);
        ws.send(JSON.stringify({ error: 'Authentication failed' }));
        return ws.close();
    }

    // Listen for incoming messages from the connected client
    ws.on('message', async (message) => {
        const { senderId, recipientId, messageText } = JSON.parse(message);

        try {
            // Check if both users are following each other
            const isSenderFollowingRecipient = await Follow.findOne({
                where: { followerId: senderId, followingId: recipientId },
            });

            const isRecipientFollowingSender = await Follow.findOne({
                where: { followerId: recipientId, followingId: senderId },
            });

            if (!isSenderFollowingRecipient || !isRecipientFollowingSender) {
                ws.send(JSON.stringify({
                    error: 'You can only send messages to users who follow you and are followed by you.',
                }));
                return;
            }

            // Save the message to the database
            const newMessage = await Message.create({
                senderId,
                recipientId,
                message: messageText,
            });

            console.log('Message saved to database:', newMessage);

            // Send the message to the recipient if they are connected
            const recipientWs = users.get(recipientId);
            if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
                recipientWs.send(JSON.stringify({
                    senderId,
                    messageText,
                    createdAt: newMessage.createdAt,
                }));
            } else {
                console.log(`Recipient ${recipientId} is not connected`);
            }
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // When the connection is closed, remove the user from the map
    ws.on('close', () => {
        console.log(`User ${ws.userId} disconnected`);
        users.delete(ws.userId);
    });
});




function broadcast(msg) {  // (4)
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    }
}

// PostgreSQL Client setup
const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'social_media',
    password: process.env.DB_PASSWORD || '***',
    port: process.env.DB_PORT || 5432,
});

// Use express routes
var userRouter = require('./routes/user');
var followRouter = require('./routes/follow');

app.use(express.json());

// Sync Sequelize models
sequelize.sync({ force: false }) // Don't overwrite data
    .then(() => console.log('Models synchronized'))
    .catch((err) => console.error('Model sync failed:', err));

// Define routes
app.use('/users', userRouter);
app.use('/follows', followRouter);
app.use('/public', express.static('public'));

// Connect to PostgreSQL database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => console.error('Connection error', err.stack));

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    client.end()
        .then(() => {
            console.log('Disconnected from PostgreSQL');
            process.exit();
        })
        .catch(err => {
            console.error('Error disconnecting from PostgreSQL', err.stack);
            process.exit(1);
        });
});

// Start the server and listen for requests
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
