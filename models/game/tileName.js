const db = require.main.require('./models');

const rankNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

db.Game.tileName = (x, y) => `${rankNames[x]}${y+1}`;