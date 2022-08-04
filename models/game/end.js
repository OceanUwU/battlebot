const db = require.main.require('./models');

db.Game.prototype.end = async function() {
    let winners = await this.getPlayers({alive: true});
    let losers = await db.Player.findAll({order: [['deathTime', 'DESC']], where: {gameId: this.id, alive: false}});
    let endMessage = await this.log(`GAME OVER! ${winners.length > 1 ? `${winners.slice(0, winners.length-1).map(p => `<@${p.user}>`).join(', ')} and <@${winners[winners.length-1].user}>` : `<@${winners[0].user}>`} WON!\n\nFinal standings:${winners.map(p => `\n1: <@${p.user}> (${p.actions} AP left over)`)}${losers.map((p,i) => `\n${winners.length+i+1}: <@${p.user}>`).join('')}\n\nFinal board:`, true, [...winners, ...losers].map(p => p.user));
    //delete game
    await db.Player.destroy({where: {gameId: this.id}});
    await db.Heart.destroy({where: {game: this.id}});
    await this.destroy();
    await endMessage.pin().catch(e => {});
};