const aliveOnly = require.main.require('./fn/aliveOnly.js');
const db = require.main.require('./models');

const cost = 3;

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to do that!`, ephemeral: true});
    await interaction.deferUpdate();
    await player.increment('range');
    await player.decrement('actions', {by: cost});
    await player.reload();
    await game.log(`<@${player.user}> (${await player.getName()}) UPGRADEd their range to ${player.range}.`);
    await interaction.editReply(await player.controlCentre());
};