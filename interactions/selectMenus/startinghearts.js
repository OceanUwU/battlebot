const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = async interaction => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    await game.update({startingHearts: Number(interaction.values)});
    await interaction.reply({content: `<@${interaction.user.id}> changed the starting hearts to ${game.startingHearts}.`, allowedMentions: {users: []}});
    await game.editSettingsMessage(interaction.message);
};