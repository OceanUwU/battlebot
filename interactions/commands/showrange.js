const db = require.main.require('./models');
const playerOnly = require.main.require('./fn/playerOnly.js');

module.exports = {
    name: 'showrange',
    description: 'Shows everyone the image you would see in your control centre.',
    async execute(interaction) {
        let [game, player] = await playerOnly(interaction);
        if (game == null) return;
        await interaction.deferReply();
        await interaction.editReply({files: [await game.renderBoard(player)]});
    }
};