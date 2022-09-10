const controlOnly = require.main.require('./fn/controlOnly.js');
const cfg = require.main.require('./cfg.json');

module.exports = {
    name: 'board',
    description: 'Displays the current board.',
    contextMenu: false,
    options: [{
        name: 'send',
        description: 'Should the board message be visible to everyone, instead of just you?',
        type: 5, //boolean
    }],
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;
        await interaction.deferReply({ephemeral: interaction.options.getBoolean('send') !== true});
        await interaction.editReply({files: [await game.render()]});
    }
};