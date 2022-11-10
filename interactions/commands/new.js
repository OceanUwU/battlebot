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
                        .setCustomId('miscoptions0')
                        .setLabel('AP steal')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('miscoptions1')
                        .setLabel('Diagonal')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('miscoptions2')
                        .setLabel('Pushing')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('miscoptions3')
                        .setLabel('Gifting')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('miscoptions4')
                        .setLabel('Upgrading')
                        .setStyle(ButtonStyle.Secondary),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('boardsize1')
                        .setLabel('w-')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('boardsize0')
                        .setLabel('w+')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('boardsize3')
                        .setLabel('h-')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('boardsize2')
                        .setLabel('h+')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('startingactions0')
                        .setLabel('AP-')
                        .setStyle(ButtonStyle.Secondary),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('startinghearts0')
                        .setLabel('♥-')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('startinghearts1')
                        .setLabel('♥+')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('startingrange0')
                        .setLabel('r-')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('startingrange1')
                        .setLabel('r+')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('startingactions1')
                        .setLabel('AP+')
                        .setStyle(ButtonStyle.Secondary),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('drops0')
                        .setLabel('Heart Drops')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('drops1')
                        .setLabel('Battery Drops')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('drops2')
                        .setLabel('Range Drops')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('drops3')
                        .setLabel('Portals')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('drops4')
                        .setLabel('Black Holes')
                        .setStyle(ButtonStyle.Secondary),
                ),
        ]});

        //create join button
        let joinMenu = await interaction.channel.send({content: 'Join here:', components: [
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
            pointRate: 12 * 60 * 60 * 1000,
            heartDrops: true,
            batteryDrops: true,
            rangeDrops: false,
            portalDrops: true,
            blackHoleDrops: false,
            startingHearts: 3,
            startingRange: 2,
            startingActions: 0,
            width: 20,
            height: 12,
            stealActions: true,
            diagonals: true,
            allowPushing: true,
            allowGifting: true,
            allowUpgrading: true,
            channel: interaction.channelId,
        });
        await game.editSettingsMessage(settingsMenu);

        let preregistrations = await db.Preregistration.findAll({where: {channel: interaction.channelId}});
        for (let preregistration of preregistrations)
            await db.Player.create({
                gameId: game.id,
                user: preregistration.user,
            });
        if (preregistrations.length > 0)
            await joinMenu.reply(`${preregistrations.map(e => `<@${e.user}>`).join('')}\nYou pre-registered for this game and have been automatically entered.`);
        await db.Preregistration.destroy({where: {channel: interaction.channelId}});
        await game.editPlayerList();
    }
};