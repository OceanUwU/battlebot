const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const controlCentre = require.main.require('./fn/controlCentre.js');
const playersInRange = require.main.require('./fn/playersInRange.js');
const tileAvailable = require.main.require('./fn/tileAvailable.js');
const pushmenu = require.main.require('./interactions/buttons/pushmenu.js');
const log = require.main.require('./fn/log.js');

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
    let players = await playersInRange(game, player);
    let pushing = players.find(p => p.id == player.playerSelection);
    if (pushing == null)
        return interaction.reply({content: 'That player is not in range, or is already dead.', ephemeral: true});
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to push someone!`, ephemeral: true});
    
    let translation = translations[direction];
    let [x, y] = [pushing.x+translation[0], pushing.y+translation[1]];
    if (!(await tileAvailable(game, x, y)))
        return interaction.reply({content: 'That tile is occupied!', ephemeral: true});

    await interaction.deferUpdate();
    await db.Player.update({actions: player.actions-cost}, {where: {id: player.id}});
    await db.Player.update({x, y}, {where: {id: pushing.id}});
    let hearted = false;
    if (await db.Heart.count({where: {game: game.id, x, y}}) > 0) {
        hearted = true;
        await db.Player.update({health: pushing.health+1, alive: true, deathTime: null}, {where: {id: pushing.id}});
        await db.Heart.destroy({where: {game: game.id, x ,y}});
    }

    await log(game, `${interaction.user.username} PUSHed <@${pushing.user}> ${hearted ? 'into the heart at' : 'to'} ${rankNames[x]}${y+1}.`);
    let updateData = await pushmenu(interaction, false);
    if (updateData === null)
        await interaction.editReply(await controlCentre(game, player));
    else
        await interaction.editReply(updateData);
    //await interaction.update(await moveMenu(interaction, game, await db.Player.findOne({where: {id: player.id}}), 'push'));
};
