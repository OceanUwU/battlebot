const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = async interaction => {
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to abort the game.', ephemeral: true});
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    await db.Player.destroy({where: {game: (await db.Game.findOne({where: {channel: interaction.channelId}})).id}});
    await db.Game.destroy({where: {id: (await db.Game.findOne({where: {channel: interaction.channelId}})).id}});
    await interaction.reply(`<@${interaction.user.id}> aborted the game.`);
};