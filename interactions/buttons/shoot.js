const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const controlCentre = require.main.require('./fn/controlCentre.js');
const playersInRange = require.main.require('./fn/playersInRange.js');
const endGame = require.main.require('./fn/endGame.js');
const log = require.main.require('./fn/log.js');

const cost = 1;

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    let players = await playersInRange(game, player);
    let shooting = players.find(p => p.id == player.playerSelection && p.alive);
    if (shooting == null)
        return interaction.reply({content: 'That player is not in range, or is already dead.', ephemeral: true});
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to shoot someone!`, ephemeral: true});
    
    await interaction.deferUpdate();
    let newHealth = shooting.health-1;
    let actionsAcquired = (newHealth <= 0) ? shooting.actions : 0;
    await db.Player.update({actions: player.actions-cost+actionsAcquired}, {where: {id: player.id}});
    await db.Player.update({health: newHealth, alive: newHealth > 0, actions: newHealth <= 0 ? 0 : shooting.actions, deathTime: newHealth <= 0 ? Date.now() : null}, {where: {id: shooting.id}});
    await log(game, `${interaction.user.username} SHOT <@${shooting.user}>, bringing them down to ${newHealth} heart${newHealth == 1 ? '' : 's'}!${newHealth <= 0 ? `\n<@${shooting.user}> died, and is now part of the jury. They can no longer use **/c**, but they can now **/vote** to vote on someone who they want to receive extra AP.` : ''}`);
    
    //end game if needed
    if ((await db.Player.count({where: {game: game.id, alive: true}})) <= 1)
        await endGame(game);
    else if (newHealth <= 0) {
        await interaction.editReply(await controlCentre(game, await db.Player.findOne({where: {id: player.id}})));
        await interaction.user.send(`You killed <@${shooting.user}> (${shooting.name})! Their ${actionsAcquired} action points were transferred to you.`);
    } else
        await interaction.editReply({content: (await controlCentre(game, await db.Player.findOne({where: {id: player.id}}))).content});
    

};
