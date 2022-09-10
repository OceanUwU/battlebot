'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('Users', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING
          },
          colour1: {
            type: Sequelize.STRING
          },
          colour2: {
            type: Sequelize.STRING
          },
          style: {
            type: Sequelize.STRING
          },
          image: {
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
        }),
        queryInterface.createTable('Images', {
          id: {
            autoIncrement: true,
            type: Sequelize.INTEGER
          },
          user: {
            type: Sequelize.STRING
          },
          name: {
            type: Sequelize.STRING
          },
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          }
        }),
      ]);
    });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable('Users'),
        queryInterface.dropTable('Images'),
      ]);
    });
  }
};