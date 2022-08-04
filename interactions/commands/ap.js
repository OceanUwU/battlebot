const aliveOnly = require.main.require('./fn/aliveOnly.js');

module.exports = {
    name: 'ap',
    description: 'Tells you how much AP you have.',
    async execute(interaction) {
        let [game, player] = await aliveOnly(interaction);
        await interaction.deferReply({ephemeral: true});
        await interaction.editReply({content: `You have ${player.actions} AP.`});
    }
};