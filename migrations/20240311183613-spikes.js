'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Games', 'spikeDrops', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Games', 'spikeDrops', { transaction: t })
      ]);
    });
  }
};