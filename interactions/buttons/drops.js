const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

const dropTypes = ['heart', 'battery', 'range', 'portal', 'blackHole', 'spike'];

module.exports = async (interaction, dropType) => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    if (!dropTypes.hasOwnProperty(dropType)) return;
    let toggling = dropTypes[dropType]+'Drops';
    await game.update({[toggling]: !game[toggling]});
    await game.editSettingsMessage(interaction, 0);
};