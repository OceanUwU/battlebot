const db = require.main.require('./models');

module.exports = async (game, player) => {
    return db.Player.count({where: {
        game: game.id,
        alive: false,
        vote: player.id,
    }})
};