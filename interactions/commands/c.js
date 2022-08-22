const db = require.main.require('./models');
const playerOnly = require.main.require('./fn/playerOnly.js');

module.exports = {
    name: 'c',
    description: 'Displays your player control centre to you.',
    contextMenu: true,
    async execute(interaction) {
        let [game, player] = await playerOnly(interaction);
        if (game == null) return;
        await interaction.deferReply({ephemeral: true});
        await interaction.editReply(await player.controlCentre());
    }
};