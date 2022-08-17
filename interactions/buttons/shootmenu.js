const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const playerOnly = require('../../fn/playerOnly');

module.exports = async interaction => {
    let [game, player] = await playerOnly(interaction);
    if (game == null) return;
    let select = await player.playersInRangeSelectMenu();
    if (select == null)
        return interaction.reply({content: 'There are no players in range to shoot!', ephemeral: true});
    interaction.update({
        ...await player.controlCentre(),
        components: [
            select,

            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('shoot')
                        .setLabel('SHOOT')
                        .setStyle(ButtonStyle.Primary),
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