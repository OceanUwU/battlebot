'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Games', 'batteryDrops', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'rangeDrops', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'portalDrops', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'blackHoleDrops', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        }, { transaction: t }),
        queryInterface.addColumn('Hearts', 'type', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
        }, { transaction: t }),
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Games', 'batteryDrops', { transaction: t }),
        queryInterface.removeColumn('Games', 'rangeDrops', { transaction: t }),
        queryInterface.removeColumn('Games', 'portalDrops', { transaction: t }),
        queryInterface.removeColumn('Games', 'blackHoleDrops', { transaction: t }),
        queryInterface.removeColumn('Hearts', 'type', { transaction: t }),
      ]);
    });
  }
};
