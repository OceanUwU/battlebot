const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');

const cost = 1;

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    let players = await player.playersInRange();
    let shooting = players.find(p => p.id == player.playerSelection && p.alive);
    if (shooting == null)
        return interaction.reply({content: 'That player is not in range, or is already dead.', ephemeral: true});
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to shoot someone!`, ephemeral: true});
    
    await interaction.deferUpdate();
    let newHealth = shooting.health-1;
    let actionsAcquired = (newHealth <= 0) ? shooting.actions : 0;
    await player.increment('actions', {by: actionsAcquired-cost});
    await player.reload();
    await shooting.update({health: newHealth, alive: newHealth > 0, actions: newHealth <= 0 ? 0 : shooting.actions, deathTime: newHealth <= 0 ? Date.now() : null});
    await game.log(`<@${player.user}> (${await player.getName()}) SHOT <@${shooting.user}>, bringing them down to ${newHealth} heart${newHealth == 1 ? '' : 's'}!${newHealth <= 0 ? `\n<@${shooting.user}> died, and is now part of the jury. They can no longer use **/c**, but they can now **/vote** to vote on someone who they want to receive extra AP.` : ''}`, true, [shooting.user]);
    
    //end game if needed
    if (newHealth <= 0 && (await db.Player.count({where: {gameId: game.id, alive: true}})) <= 1)
        await game.end();
    else if (newHealth <= 0) {
        await interaction.editReply(await player.controlCentre());
        await interaction.user.send(`You killed <@${shooting.user}> (${shooting.name}) in <#${interaction.channel.id}> (#${interaction.channel.name}). Their ${actionsAcquired} action points were transferred to you.`);
    } else
        await interaction.editReply({...await player.controlCentre(), components: interaction.message.components});
};
