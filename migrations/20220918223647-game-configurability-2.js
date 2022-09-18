'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Games', 'startingActions', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'stealActions', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: true,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'diagonals', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: true,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'allowPushing', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: true,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'allowGifting', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: true,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'allowUpgrading', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: true,
        }, { transaction: t }),
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Games', 'startingActions', { transaction: t }),
        queryInterface.removeColumn('Games', 'stealActions', { transaction: t }),
        queryInterface.removeColumn('Games', 'diagonals', { transaction: t }),
        queryInterface.removeColumn('Games', 'allowPushing', { transaction: t }),
        queryInterface.removeColumn('Games', 'allowGifting', { transaction: t }),
        queryInterface.removeColumn('Games', 'allowUpgrading', { transaction: t }),
      ]);
    });
  }
};