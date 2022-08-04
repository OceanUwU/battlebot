const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const db = require.main.require('./models');
const isMod = require('../../fn/isMod');
const pointRates = require('../../consts/pointRates');

module.exports = {
    name: 'new',
    description: 'Creates a new Battlebot game.',
    async execute(interaction) {
        if (interaction.channel.type != 'GUILD_TEXT')
            return interaction.reply({content: 'This command must be used in a text channel.', ephemeral: true});
        if (await db.Game.count({where: {channel: interaction.channelId}}) > 0)
            return interaction.reply({content: 'There\'s an ongoing game in this channel.', ephemeral: true});
        if (!isMod(interaction))
            return interaction.reply({content: 'You must have the Manage Server permission to use this command.', ephemeral: true});

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
        let joinMenu = await interaction.channel.send({content: 'Players:', components: [joinButtons]});

        //create start button + options
        let options = [
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('boardsize')
                        .setPlaceholder('Board size')
                        .addOptions([[8, 8], [12, 8], [12, 12], [16, 12], [20, 12], [20, 16], [20, 20]].map(s => `${s[0]}x${s[1]}`).map(s => ({label: s, value: s}))),
                ),
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('pointrate')
                        .setPlaceholder('AP distribution interval')
                        .addOptions(pointRates.map(pr => ({
                            label: pr[0],
                            description: pr.length > 2 ? pr[2] : `AP will be automatically distributed every ${pr[0]}.`,
                            value: String(pr[1])
                        }))),
                ),
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('startinghearts')
                        .setPlaceholder('Starting Hearts')
                        .addOptions([1,2,3,4,5,6,7,8,9,10].map(n => String(n)).map(n => ({label: n, value: n}))),
                ),
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('startingrange')
                        .setPlaceholder('Starting Range')
                        .addOptions([0,1,2,3,4,5,6,7,8,9,10].map(n => String(n)).map(n => ({label: n, value: n}))),
                ),
        ];
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
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('heartdrops')
                    .setLabel('Toggle Heart Drops')
                    .setStyle('SECONDARY'),
            );
        let startMenu = await interaction.channel.send({content: 'Start the game here (only mods may use these)', components: [...options, startButton]});

        await joinMenu.pin().catch(e => {});

        let game = await db.Game.create({
            started: false,
            finished: false,
            joinMenu: joinMenu.id,
            pointRate: 0,
            heartDrops: false,
            startingHearts: 3,
            startingRange: 2,
            width: 20,
            height: 12,
            channel: interaction.channelId,
        });
        await game.editSettingsMessage(startMenu);

        return interaction.reply({content: 'Game created.', ephemeral: true});
    }
};