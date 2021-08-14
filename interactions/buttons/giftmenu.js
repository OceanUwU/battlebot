const { MessageActionRow, MessageButton } = require('discord.js');
const aliveOnly = require('../../fn/aliveOnly');
const controlCentre = require('../../fn/controlCentre');
const playersInRangeSelectMenu = require('../../fn/playersInRangeSelectMenu');

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    let select = await playersInRangeSelectMenu(game, player);
    if (select == null)
        return interaction.reply({content: 'There are no players in range to gift!', ephemeral: true});
    interaction.update({
        ...await controlCentre(game, player),
        components: [
            select,

            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('gift0')
                        .setLabel('GIFT AP')
                        .setStyle('PRIMARY'),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('gift1')
                        .setLabel('GIFT heart')
                        .setStyle('SUCCESS'),
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