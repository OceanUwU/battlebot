'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t =>
      queryInterface.createTable('Preregistrations', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        user: {
          allowNull: false,
          type: Sequelize.STRING
        },
        channel: {
          allowNull: false,
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
      })
    );
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => 
      queryInterface.dropTable('Preregistrations')
    );
  }
};