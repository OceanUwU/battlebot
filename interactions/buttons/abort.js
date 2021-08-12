const db = require.main.require('./models');

module.exports = async interaction => {
    await db.Player.destroy({where: {game: (await db.Game.findOne({where: {setupChannel: interaction.channelId}})).id}});
    await db.Game.destroy({where: {id: (await db.Game.findOne({where: {setupChannel: interaction.channelId}})).id}});
    await interaction.reply(`<@${interaction.user.id}> aborted the game. This thread will now be archived.`);
    await interaction.message.channel.setArchived(true, 'game was aborted');
};