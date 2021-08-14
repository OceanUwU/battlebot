const db = require.main.require('./models');

module.exports = async interaction => {
    if (!interaction.message.content.includes(interaction.user.id)) {
        let game = await db.Game.findOne({where: {setupChannel: interaction.channelId}});
        if (!game)
            return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
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
        await interaction.message.edit(`${interaction.message.content}\n<@${interaction.user.id}>`);
        await interaction.reply({content: 'You successfully joined the game!', ephemeral: true});
    } else
        await interaction.reply({content: 'You can\'t join a game twice!', ephemeral: true});
};