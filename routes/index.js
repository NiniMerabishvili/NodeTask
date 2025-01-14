const { Sequelize } = require('sequelize');
const config = require('../config/config'); // Path to your config file
const db = {};

// Initialize Sequelize instance with config
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql', // or 'postgres', 'sqlite', etc. based on your config
});

// Import your models
const User = require('./User');
const Follow = require('./Follow');

// Set up associations if needed
User.associate && User.associate(db);
Follow.associate && Follow.associate(db);

// Add sequelize instance to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export db object
module.exports = db;
