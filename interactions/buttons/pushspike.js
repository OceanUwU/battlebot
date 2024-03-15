const { Op } = require("sequelize");
const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const pushspikemenu = require.main.require('./interactions/buttons/pushspikemenu.js');

const cost = 1;

const translations = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
];

module.exports = async (interaction, direction) => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    let spike = await db.Heart.findOne({where: {
        id: player.spikeSelected,
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
    if (spike == null)
        return interaction.reply({content: 'That spike is not in range!', ephemeral: true});
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to push a spike!`, ephemeral: true});
    
    let translation = translations[direction];
    let [x, y] = [spike.x+translation[0], spike.y+translation[1]];
    if ((x < 0 || x >= game.width || y < 0 || y >= game.height))
        return interaction.reply({content: 'Cannot push spikes off the board!', ephemeral: true});
    if ((await db.Heart.count({where: {game: game.id, type: 5, x, y}})) > 0)
        return interaction.reply({content: 'That tile already has a spike!', ephemeral: true});

    await interaction.deferUpdate();
    await player.decrement('actions', {by: cost});
    await spike.update({x, y});
    let dropMessage = '';
    let playerAtSpike = await db.Player.findOne({where: {gameId: game.id, x, y}});
    if (playerAtSpike != null) {
        dropMessage = `\n<@${playerAtSpike.user}> (${await playerAtSpike.getName()}) was there.${await playerAtSpike.eatDrop()}`;
    }

    await game.log(`<@${player.user}> (${await player.getName()}) PUSHed the spike at ${db.Game.tileName(x-translation[0], y-translation[1])} to ${db.Game.tileName(x, y)}.${dropMessage}`, true, playerAtSpike == null ? null : [playerAtSpike.user]);
    let updateData = await pushspikemenu(interaction, false);
    if (updateData === null)
        await interaction.editReply(await player.controlCentre());
    else
        await interaction.editReply(updateData);
    //await interaction.update(await moveMenu(interaction, game, await db.Player.findOne({where: {id: player.id}}), 'push'));
};
