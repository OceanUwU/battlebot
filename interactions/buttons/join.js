const db = require.main.require('./models');
const editPlayerList = require.main.require('./fn/editPlayerList.js');

module.exports = async interaction => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (game.started)
        return interaction.reply({content: 'This game has already started.', ephemeral: true});
    if (await db.Player.count({where: {game: game.id, user: interaction.user.id}}) > 0)
        return interaction.reply({content: 'You\'ve already joined this game.', ephemeral: true});
    if ((interaction.message.content.match(/\n/g) || []).length >= 50)
        return interaction.reply({content: 'This game has 50 players! It\'s full!', ephemeral: true});
    await db.Player.create({
        game: game.id,
        user: interaction.user.id,
        alive: true,
        health: 3,
        range: 2,
        actions: 0,
        colour1: ((1<<24)*(Math.random()+1)|0).toString(16).substr(1),
        colour2: ((1<<24)*(Math.random()+1)|0).toString(16).substr(1),
    });
    //add user to the player list in message
    await editPlayerList(game, interaction.message);
    await interaction.reply({content: `<@${interaction.user.id}> joined the game!`, allowedMentions: {users: []}});
};