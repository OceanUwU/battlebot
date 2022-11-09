const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require.main.require('./models');
const join = require.main.require('./interactions/buttons/join');

module.exports = {
    name: 'join',
    description: 'Join the game',
    async execute(interaction) {
        join(interaction);
    }
};