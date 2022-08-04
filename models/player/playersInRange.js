const { Op } = require("sequelize");
const db = require('../');

db.Player.prototype.playersInRange = async function() {
    //return all (other) players in range
    await this.getGame();
    await this.game.getChannel();
    let players = await this.game.getPlayers({
        [Op.not]: {
            id: this.id,
        },
        x: {
            [Op.gte]: this.x-this.range,
            [Op.lte]: this.x+this.range,
        },
        y: {
            [Op.gte]: this.y-this.range,
            [Op.lte]: this.y+this.range,
        },
    });
    await Promise.all(players.map(async p => await p.getName()));
    return players;
};