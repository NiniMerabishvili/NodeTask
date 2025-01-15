const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt columns
});

module.exports = Message;
