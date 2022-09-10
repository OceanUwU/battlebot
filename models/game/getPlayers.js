const db = require('../');

db.Game.prototype.getPlayers = async function(extraWhere={}) {
    let players = await db.Player.findAll({where: {gameId: this.id, ...extraWhere}});
    await Promise.all(players.map(async p => {
        p.game = this;
        await p.getName();
    }));
    return players;
};