const aliveOnly = require.main.require('./fn/aliveOnly.js');
const db = require.main.require('./models');

const cost = 3;

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to do that!`, ephemeral: true});
    await interaction.deferUpdate();
    await player.increment('health');
    await player.decrement('actions', {by: cost});
    await player.reload();
    await game.log(`<@${interaction.user.id}> HEALed to ${player.health+1} hearts.`);
    await interaction.editReply(await player.controlCentre());
};