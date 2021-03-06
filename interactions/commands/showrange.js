const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const renderBoard = require.main.require('./fn/renderBoard.js');

module.exports = {
    name: 'showrange',
    description: 'Shows everyone the image you would see in your control centre.',
    async execute(interaction) {
        let [game, player] = await aliveOnly(interaction);
        if (game == null) return;
        await interaction.deferReply();
        await interaction.editReply({files: [await renderBoard(game, player)]});
    }
};