const db = require.main.require('./models');
const log = require.main.require('./fn/log.js');

module.exports = async game => {
    let winners = await db.Player.findAll({where: {game: game.id, alive: true}});
    let losers = await db.Player.findAll({order: [['deathTime', 'DESC']], where: {game: game.id, alive: false}});
    await log(game, `GAME OVER! ${winners.length > 1 ? `${winners.slice(0, winners.length-1).map(p => `<@${p.user}>`).join(', ')} and <@${winners[winners.length-1].user}>` : `<@${winners[0].user}>`} WON!\n\nFinal standings:${winners.map(p => `\n1: <@${p.user}> (${p.actions} AP left over)`)}${losers.map((p,i) => `\n${winners.length+i+1}: <@${p.user}>`).join('')}\n\nFinal board:`);
    //delete game
    await db.Player.destroy({where: {game: game.id}});
    await db.Heart.destroy({where: {game: game.id}});
    await db.Game.destroy({where: {id: game.id}});
};