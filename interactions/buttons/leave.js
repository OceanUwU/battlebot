const db = require.main.require('./models');
const editPlayerList = require.main.require('./fn/editPlayerList.js');

module.exports = async interaction => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (game.started)
        return interaction.reply({content: 'This game has already started.', ephemeral: true});
    if (await db.Player.count({where: {game: game.id, user: interaction.user.id}}) < 1)
        return interaction.reply({content: 'You need to join the game to leave it!', ephemeral: true});
    await db.Player.destroy({where: {game: game.id, user: interaction.user.id}});
    //remove player from player list in message
    await editPlayerList(game, interaction.message);
    await interaction.reply({content: `<@${interaction.user.id}> left the game!`, allowedMentions: {users: []}});
};