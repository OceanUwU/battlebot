const { Op } = require("sequelize");
const db = require.main.require('./models');
const distribute = require.main.require('./fn/distribute');

module.exports = async () => {
    let games = await db.Game.findAll({where: {
        started: true,
        nextPoint: {
            [Op.lte]: Date.now(),
        },
    }});
    games.forEach(async game => {
        if (game.pointRate != 0) {
            await distribute(game);
            await db.Game.update({nextPoint: game.nextPoint + game.pointRate}, {where: {id: game.id}});
        }
    });
};