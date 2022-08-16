const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const pushmenu = require.main.require('./interactions/buttons/pushmenu.js');

const rankNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
    let hearted = false;
    if (await db.Heart.count({where: {game: game.id, x, y}}) > 0) {
        hearted = true;
        await pushing.update({health: pushing.health+1, alive: true, deathTime: null});
        await db.Heart.destroy({where: {game: game.id, x ,y}});
    }

    await game.log(`<@${player.user}> (${await player.getName()}) PUSHed <@${pushing.user}> ${hearted ? 'into the heart at' : 'to'} ${rankNames[x]}${y+1}.`, [pushing.user]);
    let updateData = await pushmenu(interaction, false);
    if (updateData === null)
        await interaction.editReply(await player.controlCentre());
    else
        await interaction.editReply(updateData);
    //await interaction.update(await moveMenu(interaction, game, await db.Player.findOne({where: {id: player.id}}), 'push'));
};
