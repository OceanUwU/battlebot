const configMenu = require.main.require('./fn/configMenu.js');

module.exports = {
    name: 'customise',
    description: 'Customise how you look on the board.',
    contextMenu: true,
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        await interaction.editReply(await configMenu(interaction));
    }
};