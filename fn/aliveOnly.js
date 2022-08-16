const db = require.main.require('./models');
const playerOnly = require('./playerOnly.js');

module.exports = async interaction => {
    let [game, player] = await playerOnly(interaction);
    if (player == null) return [null, null];
    if (!player.alive) {
        await interaction.reply({content: 'Only alive players may use this command.', ephemeral: true});
        return [null, null];
    }
    return [game, player];
};