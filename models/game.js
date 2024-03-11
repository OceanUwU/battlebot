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
    votesneeded: DataTypes.INTEGER,
    nextPoint: DataTypes.INTEGER,
    heartDrops: DataTypes.BOOLEAN,
    batteryDrops: DataTypes.BOOLEAN,
    rangeDrops: DataTypes.BOOLEAN,
    portalDrops: DataTypes.BOOLEAN,
    blackHoleDrops: DataTypes.BOOLEAN,
    channel: DataTypes.STRING,
    joinMenu: DataTypes.STRING,
    startingHearts: DataTypes.INTEGER,
    startingRange: DataTypes.INTEGER,
    startingActions: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    stealActions: DataTypes.BOOLEAN,
    diagonals: DataTypes.BOOLEAN,
    allowPushing: DataTypes.BOOLEAN,
    allowGifting: DataTypes.BOOLEAN,
    allowUpgrading: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};