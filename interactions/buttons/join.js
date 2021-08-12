const db = require.main.require('./models');

module.exports = async interaction => {
    if (!interaction.message.content.includes(interaction.user.id)) {
        if ((interaction.message.content.match(/\n/g) || []).length >= 50)
            return interaction.reply({content: 'This game has 50 players! It\'s full!', ephemeral: true});
        await db.Player.create({
            game: (await db.Game.findOne({where: {setupChannel: interaction.channelId}})).id,
            user: interaction.user.id,
            alive: true,
            health: 3,
            range: 2,
            actions: 0,
        });
        //add user to the player list in message
        await interaction.message.edit(`${interaction.message.content}\n<@${interaction.user.id}>`);
        await interaction.reply({content: 'You successfully joined the game!', ephemeral: true});
    } else
        await interaction.reply({content: 'You can\'t join a game twice!', ephemeral: true});
};