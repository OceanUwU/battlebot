const db = require('../');

db.Game.prototype.tileAvailable = async function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    if ((await db.Player.count({where: {gameId: this.id, x, y}})) > 0) return false;
    return true;
};