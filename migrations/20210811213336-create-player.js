'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      game: {
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.STRING
      },
      colour1: {
        type: Sequelize.STRING
      },
      colour2: {
        type: Sequelize.STRING
      },
      alive: {
        type: Sequelize.BOOLEAN
      },
      playerSelection: {
        type: Sequelize.INTEGER
      },
      deathTime: {
        type: Sequelize.INTEGER
      },
      x: {
        type: Sequelize.INTEGER
      },
      y: {
        type: Sequelize.INTEGER
      },
      vote: {
        type: Sequelize.INTEGER
      },
      health: {
        type: Sequelize.INTEGER
      },
      range: {
        type: Sequelize.INTEGER
      },
      actions: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Players');
  }
};