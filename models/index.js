'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.json');
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


require('./game/distribute');
require('./game/end');
require('./game/editPlayerList');
require('./game/editSettingsMessage');
require('./game/getChannel');
require('./game/getPlayers');
require('./game/log');
require('./game/render');
require('./game/tileAvailable');
require('./game/tileName');

require('./player/controlCentre');
require('./player/eatDrop');
require('./player/getConfig');
require('./player/getGame');
require('./player/getName');
require('./player/getVotes');
require('./player/playersInRange');
require('./player/playersInRangeSelectMenu');
require('./player/render');