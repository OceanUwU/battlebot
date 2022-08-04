const { MessageActionRow, MessageButton } = require('discord.js');
const aliveOnly = require('../../fn/aliveOnly');

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    let select = await player.playersInRangeSelectMenu();
    if (select == null)
        return interaction.reply({content: 'There are no players in range to shoot!', ephemeral: true});
    interaction.update({
        ...await player.controlCentre(),
        components: [
            select,

            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('shoot')
                        .setLabel('SHOOT')
                        .setStyle('PRIMARY'),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('maincontrolmenu')
                        .setLabel('Back')
                        .setStyle('DANGER'),
                ),
        ],
    });
};