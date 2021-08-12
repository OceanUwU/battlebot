'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Game.init({
    started: DataTypes.BOOLEAN,
    finished: DataTypes.BOOLEAN,
    pointRate: DataTypes.INTEGER,
    nextPoint: DataTypes.INTEGER,
    setupChannel: DataTypes.STRING,
    commandChannel: DataTypes.STRING,
    logChannel: DataTypes.STRING,
    playerRole: DataTypes.STRING,
    juryRole: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};