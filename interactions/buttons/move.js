const moveMenu = require("../../fn/moveMenu");
const log = require("../../fn/log");
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const tileAvailable = require.main.require('./fn/tileAvailable.js');

const db = require.main.require('./models');
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
    let translation = translations[direction];
    let [x, y] = [player.x+translation[0], player.y+translation[1]];
    if (!(await tileAvailable(game, x, y)))
        return interaction.reply({content: 'That tile is occupied!', ephemeral: true});
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to do that!`, ephemeral: true});
    //await interaction.deferUpdate();
    await db.Player.update({x, y, actions: player.actions - cost}, {where: {id: player.id}});
    let hearted = false;
    if (await db.Heart.count({where: {game: game.id, x, y}}) > 0) {
        hearted = true;
        await db.Player.update({health: player.health+1}, {where: {id: player.id}});
        await db.Heart.destroy({where: {game: game.id, x ,y}});
    }
    await interaction.update(await moveMenu(interaction, game, await db.Player.findOne({where: {id: player.id}}), 'move'));
    await log(game, `${interaction.user.username} MOVEd to ${rankNames[x]}${y+1}${hearted ? ' and picked up a heart!' : '.'}`);
};