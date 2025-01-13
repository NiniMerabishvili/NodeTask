const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); 

const Follow = sequelize.define('Follow', {
    followerId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    followingId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

module.exports = Follow;
