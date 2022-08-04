const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');
const isMod = require('../../fn/isMod');

const votesPerAction = 3;

module.exports = {
    name: 'distribute',
    description: 'Distributes 1 AP to every alive player (plus extra to those who\'ve received votes from the jury).',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;
        if (!isMod(interaction))
            return interaction.reply({content: 'You must have the Manage Server permission to use this command.', ephemeral: true});
        await interaction.deferReply({ephemeral: true});
        await game.distribute(interaction);
        await interaction.editReply({content: 'Successfully distributed AP.'});
    }
};