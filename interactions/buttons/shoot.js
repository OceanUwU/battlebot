const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const controlCentre = require.main.require('./fn/controlCentre.js');
const playersInRange = require.main.require('./fn/playersInRange.js');
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
    let newHealth = shooting.health-1;
    let actionsAcquired = (newHealth <= 0) ? shooting.actions : 0;
    await db.Player.update({actions: player.actions-cost+actionsAcquired}, {where: {id: player.id}});
    await db.Player.update({health: newHealth, alive: newHealth > 0, actions: newHealth <= 0 ? 0 : shooting.actions, deathTime: newHealth <= 0 ? null : Date.now()}, {where: {id: shooting.id}});
    if (newHealth <= 0) {
        let shootingMember = await interaction.guild.members.fetch(shooting.user);
        await shootingMember.roles.remove(game.playerRole);
        await shootingMember.roles.add(game.juryRole);
        await interaction.update(await controlCentre(game, await db.Player.findOne({where: {id: player.id}})));
        await interaction.user.send(`You killed <@${shooting.user}>! Their ${actionsAcquired} action points were transferred to you.`);
    } else
        await interaction.update({content: (await controlCentre(game, await db.Player.findOne({where: {id: player.id}}))).content});
    await log(game, `${interaction.user.username} SHOT <@${shooting.user}>, bringing them down to ${newHealth} heart${newHealth == 1 ? '' : 's'}!${newHealth <= 0 ? `\n<@${shooting.user}> died, and is now part of the jury. They can no longer use **/c**, but they can now **/vote** to vote on someone who they want to receive extra AP.` : ''}`);

    //end game if needed
    if ((await db.Player.count({where: {game: game.id, alive: true}})) <= 1) {
        let placings = [player, ...await db.Player.findAll({order: [['deathTime', 'DESC']], where: {alive: false}})]
        await log(game, `GAME OVER! <@${player.user}> WON! They had ${player.actions-cost+actionsAcquired}AP left over.\n\nFinal standings:${placings.map((p,i) => `\n${i+1}: <@${p.user}>`).join('')}\n\nFinal board:`);
        //delete game
        await db.Player.destroy({where: {game: game.id}});
        await db.Game.destroy({where: {id: game.id}});
    }
};