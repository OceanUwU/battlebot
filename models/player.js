'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Player.init({
    game: DataTypes.INTEGER,
    user: DataTypes.STRING,
    colour1: DataTypes.STRING,
    colour2: DataTypes.STRING,
    alive: DataTypes.BOOLEAN,
    playerSelection: DataTypes.INTEGER,
    deathTime: DataTypes.INTEGER,
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    vote: DataTypes.INTEGER,
    health: DataTypes.INTEGER,
    range: DataTypes.INTEGER,
    actions: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};