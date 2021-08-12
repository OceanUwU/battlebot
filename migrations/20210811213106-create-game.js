'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      started: {
        type: Sequelize.BOOLEAN
      },
      finished: {
        type: Sequelize.BOOLEAN
      },
      pointRate: {
        type: Sequelize.INTEGER
      },
      nextPoint: {
        type: Sequelize.INTEGER
      },
      setupChannel: {
        type: Sequelize.STRING
      },
      commandChannel: {
        type: Sequelize.STRING
      },
      logChannel: {
        type: Sequelize.STRING
      },
      playerRole: {
        type: Sequelize.STRING
      },
      juryRole: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Games');
  }
};