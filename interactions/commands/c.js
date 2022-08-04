const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');

module.exports = {
    name: 'c',
    description: 'Displays your player control centre to you.',
    async execute(interaction) {
        let [game, player] = await aliveOnly(interaction);
        if (game == null) return;
        await interaction.deferReply({ephemeral: true});
        await interaction.editReply(await player.controlCentre());
    }
};