const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const playerOnly = require('../../fn/playerOnly');

module.exports = async interaction => {
    let [game, player] = await playerOnly(interaction);
    if (game == null) return;
    let select = await player.playersInRangeSelectMenu();
    if (select == null)
        return interaction.reply({content: 'There are no players in range to gift!', ephemeral: true});
    interaction.update({
        ...await player.controlCentre(),
        components: [
            select,

            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('gift0')
                        .setLabel('GIFT AP')
                        .setStyle(ButtonStyle.Primary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('gift1')
                        .setLabel('GIFT heart')
                        .setStyle(ButtonStyle.Success),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('maincontrolmenu')
                        .setLabel('Back')
                        .setStyle(ButtonStyle.Danger),
                ),
        ],
    });
};