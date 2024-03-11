const moveMenu = require("../../fn/moveMenu");
const aliveOnly = require.main.require('./fn/aliveOnly.js');

const db = require.main.require('./models');
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
    if (!(await game.tileAvailable(x, y)))
        return interaction.reply({content: 'That tile is occupied!', ephemeral: true});
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to do that!`, ephemeral: true});
    await interaction.deferUpdate();
    await player.update({x, y, actions: player.actions - cost});
    let dropMessage = await player.eatDrop();
    await game.log(`<@${player.user}> (${await player.getName()}) MOVEd to ${db.Game.tileName(x, y)}.${dropMessage}`);
    await interaction.editReply(await moveMenu(interaction, game, await db.Player.findOne({where: {id: player.id}}), 'move'));
};