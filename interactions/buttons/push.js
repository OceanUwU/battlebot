const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const pushmenu = require.main.require('./interactions/buttons/pushmenu.js');

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
    let players = await player.playersInRange();
    let pushing = players.find(p => p.id == player.playerSelection);
    if (pushing == null)
        return interaction.reply({content: 'That player is not in range, or is already dead.', ephemeral: true});
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to push someone!`, ephemeral: true});
    
    let translation = translations[direction];
    let [x, y] = [pushing.x+translation[0], pushing.y+translation[1]];
    if (!(await game.tileAvailable(x, y)))
        return interaction.reply({content: 'That tile is occupied!', ephemeral: true});

    await interaction.deferUpdate();
    await player.decrement('actions', {by: cost});
    await pushing.update({x, y});
    let dropMessage = await pushing.eatDrop();

    await game.log(`<@${player.user}> (${await player.getName()}) PUSHed <@${pushing.user}> to ${db.Game.tileName(x, y)}.${dropMessage}`, [pushing.user]);
    let updateData = await pushmenu(interaction, false);
    if (updateData === null)
        await interaction.editReply(await player.controlCentre());
    else
        await interaction.editReply(updateData);
    //await interaction.update(await moveMenu(interaction, game, await db.Player.findOne({where: {id: player.id}}), 'push'));
};
