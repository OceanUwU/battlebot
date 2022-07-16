const db = require.main.require('./models');
const isMod = require('../../fn/isMod');
const editSettingsMessage = require('../../fn/editSettingsMessage');

module.exports = async interaction => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    await db.Game.update({heartDrops: interaction.values == '1'}, {where: {id: game.id}});
    await interaction.reply({content: `<@${interaction.user.id}> turned heart drops ${interaction.values == '1' ? 'on' : 'off'}.`, allowedMentions: {users: []}});
    await editSettingsMessage(await db.Game.findOne({where: {id: game.id}}), interaction.message);
};