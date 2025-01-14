'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Follows', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      followerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      followingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add composite unique constraint
    await queryInterface.addConstraint('Follows', {
      fields: ['followerId', 'followingId'],
      type: 'unique',
      name: 'follower_following_unique_constraint',
    });

    // Add indexes for performance
    await queryInterface.addIndex('Follows', ['followerId']);
    await queryInterface.addIndex('Follows', ['followingId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Follows');
  },
};
