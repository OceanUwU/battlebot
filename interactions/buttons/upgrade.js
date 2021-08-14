const aliveOnly = require.main.require('./fn/aliveOnly.js');
const log = require("../../fn/log");
const controlCentre = require.main.require('./fn/controlCentre.js');
const db = require.main.require('./models');

const cost = 3;

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    if (player.actions < cost)
        return interaction.reply({content: `You need ${cost} AP to do that!`, ephemeral: true});
    await db.Player.update({range: player.range+1, actions: player.actions-cost}, {where: {id: player.id}});
    await log(game, `${interaction.user.username} UPGRADEd their range to ${player.range+1}.`);
    await interaction.update(await controlCentre(game, await db.Player.findOne({where: {id: player.id}})));
};