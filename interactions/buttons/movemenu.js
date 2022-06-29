const { MessageActionRow, MessageButton } = require('discord.js');
const aliveOnly = require('../../fn/aliveOnly');
const moveMenu = require('../../fn/moveMenu');
const db = require.main.require('./models');


module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    await interaction.update(await moveMenu(interaction, game, player, 'move'));
};