// Import dependencies
const express = require('express');
const { Client } = require('pg');
require('dotenv').config();
const User = require('./models/user');
const Follow = require('./models/follow');
const sequelize = require('./config/database');

const app = express();
const port = process.env.PORT || 3001;

var userRouter = require('./routes/user');
var followRouter = require('./routes/follow');

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'social_media',
    password: process.env.DB_PASSWORD || 'networkers123',
    port: process.env.DB_PORT || 5432,
});

app.use(express.json());

sequelize.sync({ force: false }) // Don't overwrite data
    .then(() => console.log('Models synchronized'))
    .catch((err) => console.error('Model sync failed:', err));

app.use('/users', userRouter);
app.use('/follows', followRouter);
app.use('/public', express.static('public'));

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => console.error('Connection error', err.stack));

app.get('/', (req, res) => {
    res.send('Hello World');
});

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});