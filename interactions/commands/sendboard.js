const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');
const renderBoard = require.main.require('./fn/renderBoard.js');

module.exports = {
    name: 'sendboard',
    description: 'Sends the current board in a message everyone can see.',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;
        await interaction.deferReply();
        await interaction.editReply({files: [await renderBoard(game)]});
    }
};