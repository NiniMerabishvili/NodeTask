const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follow = sequelize.define(
    'Follow',
    {
        followerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        followingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    {
        timestamps: true, // Add `createdAt` and `updatedAt`
        tableName: 'Follows', // Ensure table name is correct
        freezeTableName: true, // Prevent Sequelize from pluralizing the table name
    }
);

module.exports = Follow;
