const playerOnly = require.main.require('./fn/playerOnly.js');

module.exports = async interaction => {
    let [game, player] = await playerOnly(interaction);
    if (game == null) return;
    await interaction.deferUpdate();
    await interaction.editReply({...await player.controlCentre(), components: interaction.message.components});
};