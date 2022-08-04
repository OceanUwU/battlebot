const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');

module.exports = async (interaction, type) => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    let players = await player.playersInRange();
    let gifting = players.find(p => p.id == player.playerSelection);
    if (gifting == null)
        return interaction.reply({content: 'That player is not in range.', ephemeral: true});
    if (type == 0) { //action
        if (player.actions < 1)
            return interaction.reply({content: 'You don\'t have any AP to gift!', ephemeral: true});
        if (!gifting.alive)
            return interaction.reply({content: 'Dead players can\'t be gifted AP.', ephemeral: true});

        await interaction.deferUpdate();
        await player.decrement('actions');
        await player.reload();
        await gifting.increment('actions');
        await (await interaction.client.users.fetch(gifting.user)).send(`<@${interaction.user.id}> (${interaction.user.username}${interaction.member.nickname == null ? '' : ` / ${interaction.member.nickname}`}) GIFTed you 1 AP in <#${interaction.channel.id}> (#${interaction.channel.name}).`);
    } else if (type == 1) { //health
        await interaction.deferUpdate();
        await player.update({health: player.health-1, alive: player.health > 1, deathTime: player.health == 1 ? Date.now() : null});
        await gifting.update({health: gifting.health+1, alive: true, deathTime: null});
        await game.log(`<@${player.user}> GIFTed <@${gifting.user}> a heart.${gifting.alive ? '' : `\n<@${gifting.user}> was revived! They can no longer **/vote** as a jury member, but they can use **/c** again!`}`, true, [gifting.user]);
        if ((await db.Player.count({where: {gameId: game.id, alive: true}})) <= 1)
            await game.end();
    }
    await interaction.editReply({content: (await player.controlCentre()).content});
};