const { MessageActionRow, MessageButton } = require('discord.js');
const db = require.main.require('./models');

module.exports = {
    name: 'join',
    description: 'Join the game',
    async execute(interaction) {
        let game = await db.Game.findOne({where: {channel: interaction.channelId}});
        if (!game)
            return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
        await interaction.reply({content: 'Join using the link below:', ephemeral: true, components: [
            new MessageActionRow().addComponents(new MessageButton().setLabel('Join').setStyle('LINK').setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${game.joinMenu}`))
        ]});
    }
};