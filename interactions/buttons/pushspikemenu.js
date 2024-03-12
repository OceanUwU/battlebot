const { Op } = require("sequelize");
const db = require.main.require('./models');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const playerOnly = require('../../fn/playerOnly');
const moveMenu = require('../../fn/moveMenu');

module.exports = async (interaction, reply=true) => {
    let [game, player] = await playerOnly(interaction);
    if (game == null) return;
    let spikes = await db.Heart.findAll({where: {
        game: game.id,
        type: 5,
        x: {
            [Op.gte]: player.x-player.range,
            [Op.lte]: player.x+player.range,
        },
        y: {
            [Op.gte]: player.y-player.range,
            [Op.lte]: player.y+player.range,
        },
    }});

    if (spikes.length == 0) {
        if (reply)
            await interaction.reply({content: 'There are no spikes in range to push!', ephemeral: true});
        return null;
    }

    let options = spikes.map(spike => ({
        label: db.Game.tileName(spike.x, spike.y),
        value: String(spike.id),
    }));
    options.sort((a, b) => {if (a.label < b.label) return -1; else if (a.label > b.label) return 1; return 0;});
    let updateData = {
        ...await player.controlCentre(),
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('spike')
                        .setPlaceholder('Spike')
                        .addOptions(options),
                ),
            ...(await moveMenu(interaction, game, player, 'pushspike')).components
        ],
    };
    
    if (reply)
        interaction.update(updateData);
    else
        return updateData;
};