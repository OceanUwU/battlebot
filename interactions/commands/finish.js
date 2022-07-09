const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');
const isMod = require('../../fn/isMod');
const endGame = require('../../fn/endGame');

module.exports = {
    name: 'finish',
    description: 'Finishes the game. Everyone who\'s still alive wins together.',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;
        if (!isMod(interaction))
            return interaction.reply({content: 'You must have the Manage Server permission to use this command.', ephemeral: true});
        await interaction.deferReply();
        await endGame(game);
        await interaction.editReply({content: 'Game ended.'});
    }
};