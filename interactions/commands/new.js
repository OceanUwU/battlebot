const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = {
    name: 'new',
    description: 'Creates a new game of Devious Disposition.',
    async execute(interaction) {
        if (interaction.channel.type != 'GUILD_TEXT')
            return interaction.reply({content: 'This command must be used in a text channel', ephemeral: true});
        if (!isMod(interaction))
            return interaction.reply({content: 'You must have the Manage Server permission to use this command.', ephemeral: true});
        //create thread
        let msg = await interaction.reply({content: 'Here\'s a thread for joining and starting the game.', fetchReply: true});
        let thread = await msg.startThread({
            name: 'New Devious Disposition game',
            autoArchiveDuration: 1440,
        });

        //create join button
		let joinButtons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('join')
                .setLabel('Join')
                .setStyle('SUCCESS'),
        )
        .addComponents(
            new MessageButton()
                .setCustomId('leave')
                .setLabel('Leave')
                .setStyle('DANGER'),
        );
        let joinMenu = await thread.send({content: 'Players:', components: [joinButtons]});

        //create start button
		let startButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('start')
                .setLabel('Start')
                .setStyle('PRIMARY'),
        )
        .addComponents(
            new MessageButton()
                .setCustomId('abort')
                .setLabel('Abort')
                .setStyle('DANGER'),
        );
        await thread.send({content: 'Start the game here (only mods may use these)', components: [startButton]});

        await joinMenu.pin();

        await db.Game.create({
            started: false,
            finished: false,
            pointRate: 24 * 60 * 60,
            setupChannel: thread.id,
        });
    }
};