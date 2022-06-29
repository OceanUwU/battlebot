const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const db = require.main.require('./models');
const isMod = require('../../fn/isMod');
const pointRates = require('../../consts/pointRates');
const editSettingsMessage = require('../../fn/editSettingsMessage');

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
                        .setCustomId('pointRate')
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
                        .setCustomId('heartDrops')
                        .setPlaceholder('Heart drops')
                        .addOptions([
                            {
                                label: 'On',
                                description: `A collectable heart will drop on a random tile on the board every time AP is distributed.`,
                                value: '1'
                            },
                            {
                                label: 'Off',
                                value: '0'
                            },
                        ]),
                )
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
            );
        let startMenu = await interaction.channel.send({content: 'Start the game here (only mods may use these)', components: [...options, startButton]});

        await joinMenu.pin();

        await db.Game.create({
            started: false,
            finished: false,
            joinMenu: joinMenu.id,
            pointRate: 0,
            heartDrops: 0,
            channel: interaction.channelId,
        });
        await editSettingsMessage(await db.Game.findOne({where: {channel: interaction.channelId}}), startMenu);

        return interaction.reply({content: 'Game created.', ephemeral: true});
    }
};