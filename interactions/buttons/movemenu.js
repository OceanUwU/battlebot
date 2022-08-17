const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const playerOnly = require('../../fn/playerOnly');
const moveMenu = require('../../fn/moveMenu');
const db = require.main.require('./models');


module.exports = async interaction => {
    let [game, player] = await playerOnly(interaction);
    if (game == null) return;
    await interaction.update(await moveMenu(interaction, game, player, 'move'));
};