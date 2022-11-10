const db = require.main.require('./models');

module.exports = async interaction => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (game.started)
        return interaction.reply({content: 'This game has already started.', ephemeral: true});
    if (await db.Player.count({where: {gameId: game.id, user: interaction.user.id}}) > 0)
        return interaction.reply({content: 'You\'ve already joined this game.', ephemeral: true});
    if (await db.Player.count({where: {gameId: game.id}}) >= 25)
        return interaction.reply({content: 'This game has 25 players! It\'s full!', ephemeral: true});
    await db.Player.create({
        gameId: game.id,
        user: interaction.user.id,
    });
    //add user to the player list in message
    await game.editPlayerList();
    await interaction.reply({content: `<@${interaction.user.id}> joined the game!`, allowedMentions: {users: []}});
};