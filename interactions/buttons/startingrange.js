const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = async (interaction, positive) => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    let newStart = game.startingRange + (positive * 2 - 1);
    if (newStart < 0)
        return interaction.reply({content: 'Starting range must be at least 0.', ephemeral: true});
    else if (newStart > 19)
        return interaction.reply({content: 'Range cannot go above 19.', ephemeral: true});
    await game.update({startingRange: newStart});
    await game.editSettingsMessage(interaction, 1);
};