const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = async interaction => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    if (!game.started)
        return interaction.reply({content: 'You can\'t change this after the game has started.', ephemeral: true});
    let [width, height] = interaction.values[0].split('x').map(n => Number(n));
    await game.update({width, height});
    await interaction.reply({content: `<@${interaction.user.id}> changed the board size to ${game.width}x${game.height}.`, allowedMentions: {users: []}});
    await game.editSettingsMessage(interaction.message);
};