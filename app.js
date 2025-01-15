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

wss.on('connection', (ws, req) => {
    console.log('A user connected');

    ws.on('message', async (message) => {
        const { senderId, recipientId, messageText } = JSON.parse(message);

        // Your message handling logic here

        // Example: Send the message back to the recipient (simplified)
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client.userId === recipientId) {
                client.send(JSON.stringify({ senderId, messageText }));
            }
        });
    });

    ws.on('close', () => {
        console.log('User disconnected');
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
    password: process.env.DB_PASSWORD || 'networkers123',
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
