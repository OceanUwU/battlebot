const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = async (interaction, positive) => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    let newStart = game.startingHearts + (positive * 2 - 1);
    if (newStart < 1)
        return interaction.reply({content: 'Starting hearts must be at least 1.', ephemeral: true});
    await game.update({startingHearts: newStart});
    await game.editSettingsMessage(interaction);
};