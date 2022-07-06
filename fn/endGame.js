const db = require.main.require('./models');
const log = require.main.require('./fn/log.js');

module.exports = async game => {
    let winner = await db.Player.findOne({where: {game: game.id, alive: true}});
    let placings = [winner, ...await db.Player.findAll({order: [['deathTime', 'DESC']], where: {game: game.id, alive: false}})]
    await log(game, `GAME OVER! <@${winner.user}> WON! They had ${winner.actions}AP left over.\n\nFinal standings:${placings.map((p,i) => `\n${i+1}: <@${p.user}>`).join('')}\n\nFinal board:`);
    //delete game
    await db.Player.destroy({where: {game: game.id}});
    await db.Heart.destroy({where: {game: game.id}});
    await db.Game.destroy({where: {id: game.id}});
}
