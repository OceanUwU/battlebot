const db = require('../');

db.Player.prototype.getGame = async function() {
    if (!this.game)
        this.game = await db.Game.findOne({where: {game: this.game}});
};