const db = require.main.require('./models');
const playerOnly = require.main.require('./fn/playerOnly.js');

module.exports = async interaction => {
    let [game, player] = await playerOnly(interaction);
    if (game == null) return;
    await interaction.update(await player.controlCentre());
};