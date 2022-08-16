const db = require.main.require('./models');
const playerOnly = require.main.require('./fn/playerOnly.js');

module.exports = async interaction => {
    let [game, player] = await playerOnly(interaction);
    if (game == null) return;
    await db.Player.update({playerSelection: Number(interaction.values[0])}, {where: {id: player.id}});
    await interaction.deferUpdate();
};