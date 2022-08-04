const aliveOnly = require.main.require('./fn/aliveOnly.js');
const db = require.main.require('./models');

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    await interaction.update(await player.controlCentre());
};