const { Op } = require("sequelize");
const db = require.main.require('./models');
const bot = require('../');

module.exports = async function(game, player) {
    //return all (other) players in range
    await game.getChannel();
    let players = await db.Player.findAll({where: {
        game: game.id,
        [Op.not]: {
            id: player.id,
        },
        x: {
            [Op.gte]: player.x-player.range,
            [Op.lte]: player.x+player.range,
        },
        y: {
            [Op.gte]: player.y-player.range,
            [Op.lte]: player.y+player.range,
        },
    }});
    await Promise.all(players.map(async p => {
        p.game = game;
        await p.getName();
    }));
    return players;
};