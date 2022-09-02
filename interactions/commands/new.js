const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const db = require.main.require('./models');
const isMod = require('../../fn/isMod');
const pointRates = require('../../consts/pointRates');

module.exports = {
    name: 'new',
    description: 'Creates a new Battlebot game.',
    async execute(interaction) {
        if (!interaction.inGuild())
            return interaction.reply({content: 'This command must be used in a server.', ephemeral: true});
        if (await db.Game.count({where: {channel: interaction.channelId}}) > 0)
            return interaction.reply({content: 'There\'s an ongoing game in this channel.', ephemeral: true});
        if (!isMod(interaction))
            return interaction.reply({content: 'You must have the Manage Server permission or own the thread the command is being used in to use this command.', ephemeral: true});

        //create start button
        await interaction.reply({content: 'New game created!\nStart it here (only mods may use these):', components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('start')
                        .setLabel('Start')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('abort')
                        .setLabel('Abort')
                        .setStyle(ButtonStyle.Danger),
                )
        ]});

        //create start button + options
        let settingsMenu = await interaction.channel.send({content: '**__GAME SETTINGS__** (only mods may change these):', components: [
            new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('boardsize')
                        .setPlaceholder('Board size')
                        .addOptions([[8, 8], [12, 8], [12, 12], [16, 12], [20, 12], [20, 16], [20, 20]].map(s => `${s[0]}x${s[1]}`).map(s => ({label: s, value: s}))),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('pointrate')
                        .setPlaceholder('AP distribution interval')
                        .addOptions(pointRates.map(pr => ({
                            label: pr[0],
                            description: pr.length > 2 ? pr[2] : `AP will be automatically distributed every ${pr[0]}.`,
                            value: String(pr[1])
                        }))),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('drops0')
                        .setLabel('Toggle Heart Drops')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('drops1')
                        .setLabel('Toggle Battery Drops')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('drops2')
                        .setLabel('Toggle Range Drops')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('drops3')
                        .setLabel('Toggle Portals')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('drops4')
                        .setLabel('Toggle Black Holes')
                        .setStyle(ButtonStyle.Secondary),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('startinghearts1')
                        .setLabel('♥+')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('startinghearts0')
                        .setLabel('♥-')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('startingrange1')
                        .setLabel('r+')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('startingrange0')
                        .setLabel('r-')
                        .setStyle(ButtonStyle.Secondary),
                ),
        ]});

        //create join button
        let joinMenu = await interaction.channel.send({content: 'Players:', components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('join')
                        .setLabel('Join')
                        .setStyle(ButtonStyle.Success),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('leave')
                        .setLabel('Leave')
                        .setStyle(ButtonStyle.Danger),
                )
        ]});

        await joinMenu.pin().catch(e => {});

        let game = await db.Game.create({
            started: false,
            finished: false,
            joinMenu: joinMenu.id,
            pointRate: 24 * 60 * 60 * 1000,
            heartDrops: true,
            startingHearts: 3,
            startingRange: 2,
            width: 20,
            height: 12,
            channel: interaction.channelId,
        });
        await game.editSettingsMessage(settingsMenu);
    }
};