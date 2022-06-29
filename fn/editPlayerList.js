const db = require.main.require('./models');

module.exports = async (game, msg) => {
    let players = await db.Player.findAll({where: {game: game.id}});
    await msg.edit(`Players (${players.length}):\n\n${players.map(p => `<@${p.user}>`).join('\n')}`);
};