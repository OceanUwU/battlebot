const { MessageActionRow, MessageButton } = require('discord.js');
const playerOnly = require('../../fn/playerOnly');
const moveMenu = require('../../fn/moveMenu');

module.exports = async (interaction, reply=true) => {
    let [game, player] = await playerOnly(interaction);
    if (game == null) return;
    let select = await player.playersInRangeSelectMenu();
    if (select == null) {
        if (reply)
            await interaction.reply({content: 'There are no players in range to push!', ephemeral: true});
        return null;
    }

    let updateData = {
        ...await player.controlCentre(),
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