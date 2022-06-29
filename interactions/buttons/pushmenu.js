const { MessageActionRow, MessageButton } = require('discord.js');
const aliveOnly = require('../../fn/aliveOnly');
const controlCentre = require('../../fn/controlCentre');
const moveMenu = require('../../fn/moveMenu');
const playersInRangeSelectMenu = require('../../fn/playersInRangeSelectMenu');

module.exports = async (interaction, reply=true) => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    let select = await playersInRangeSelectMenu(game, player);
    if (select == null) {
        if (reply)
            await interaction.reply({content: 'There are no players in range to push!', ephemeral: true});
        return null;
    }

    let updateData = {
        ...await controlCentre(game, player),
        components: [
            select,
            ...(await moveMenu(interaction, game, player, 'push')).components
        ],
    };
    
    if (reply)
        interaction.update(updateData);
    else
        return updateData;
};