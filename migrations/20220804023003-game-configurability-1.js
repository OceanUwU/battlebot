'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Games', 'startingHearts', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 3,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'startingRange', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 2,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'width', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 20,
        }, { transaction: t }),
        queryInterface.addColumn('Games', 'height', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 12,
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Games', 'startingHearts', { transaction: t }),
        queryInterface.removeColumn('Games', 'startingRange', { transaction: t }),
        queryInterface.removeColumn('Games', 'width', { transaction: t }),
        queryInterface.removeColumn('Games', 'height', { transaction: t })
      ]);
    });
  }
};