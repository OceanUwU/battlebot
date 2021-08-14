const { Op } = require("sequelize");
const db = require.main.require('./models');
const bot = require('../');

module.exports = async function(game, player) {
    //return all (other) players in range
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
        let user = await bot.users.fetch(p.user);
        p.name = user.username;
    }));
    return players;
};