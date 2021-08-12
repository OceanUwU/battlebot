const db = require.main.require('./models');

module.exports = async interaction => {
    if (interaction.message.content.includes(interaction.user.id)) {
        await db.Player.destroy({where: {game: (await db.Game.findOne({where: {setupChannel: interaction.channelId}})).id, user: interaction.user.id}});
        //remove player from player list in message
        await interaction.message.edit(interaction.message.content.slice(0, interaction.message.content.indexOf(interaction.user.id)-3)+interaction.message.content.slice(interaction.message.content.indexOf(interaction.user.id)+interaction.user.id.length+1));
        await interaction.reply({content: 'You successfully left the game!', ephemeral: true});
    } else
        await interaction.reply({content: 'You need to join the game to leave it!', ephemeral: true});
};