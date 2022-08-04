const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = async interaction => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    await game.update({heartDrops: !game.heartDrops});
    await interaction.reply({content: `<@${interaction.user.id}> turned heart drops ${game.heartDrops ? 'on' : 'off'}.`, allowedMentions: {users: []}});
    await game.editSettingsMessage(interaction.message);
};