const db = require.main.require('./models');

async function tileAvailable(game, x, y) {
    if (x < 0 || x >= 20 || y < 0 || y >= 12) return false;
    if ((await db.Player.count({where: {game: game.id, x, y}})) > 0) return false;
    return true;
}

module.exports = tileAvailable;