const { Sequelize } = require('sequelize');
const User = require('./user');
const Follow = require('./follow');
const config = require('../config/config'); // Adjust the path to your config file

const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

// Initialize Sequelize instance
const sequelize = new Sequelize(currentConfig.url, {
    dialect: currentConfig.dialect,
});

User.belongsToMany(User, {
    through: Follow,
    as: 'Followers',
    foreignKey: 'followingId',
    otherKey: 'followerId',
});

User.belongsToMany(User, {
    through: Follow,
    as: 'Following',
    foreignKey: 'followerId',
    otherKey: 'followingId',
});
// Export sequelize instance for use elsewhere
module.exports = {
    sequelize,
    User,
    Follow,
};