const db = require.main.require('./models');

module.exports = {
    name: 'preregister',
    description: 'Pre-register for the next game. You\'ll automatically join the next game created in this channel.',
    async execute(interaction) {
        let details = {
            user: interaction.user.id,
            channel: interaction.channelId
        };
        if (await db.Preregistration.count({where: details}) > 0)
            return interaction.reply({content: 'You\'re already pre-registered for the next game. The next time a game is created in this channel, you\'ll automatically join it.', ephemeral: true});
        if (await db.Preregistration.count({where: {channel: details.channel}}) >= 25)
            return interaction.reply({content: 'The maximum amount of people have already pre-registered for this game.', ephemeral: true});
        await db.Preregistration.create(details);
        await interaction.reply({content: `<@${details.user}> pre-registered for the next game.`, allowedMentions: {}});
    }
};