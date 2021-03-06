'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      discord_id: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      access_token: {
        type: Sequelize.STRING
      },
      expiry: {
        type: Sequelize.BIGINT
      },
      refresh_token: {
        type: Sequelize.STRING
      },
      date_visited: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};