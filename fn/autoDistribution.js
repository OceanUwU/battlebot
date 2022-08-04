const { Op } = require("sequelize");
const db = require.main.require('./models');

module.exports = async () => {
    let games = await db.Game.findAll({where: {
        started: true,
        nextPoint: {
            [Op.lte]: Date.now(),
        },
    }});
    games.filter(game => game.pointRate != 0).forEach(async game => {
        await game.distribute();
        await game.increment('nextPoint', {by: game.pointRate});
    });
};