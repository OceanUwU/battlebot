const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const controlCentre = require.main.require('./fn/controlCentre.js');

module.exports = {
    name: 'ap',
    description: 'Tells you how much ap you have.',
    async execute(interaction) {
        let [game, player] = await aliveOnly(interaction);
        await interaction.deferReply({ephemeral: true});
        await interaction.editReply({content: `You have ${player.actions} AP.`});
    }
};