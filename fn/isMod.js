const { ThreadChannel, PermissionsBitField } = require('discord.js');
const cfg = require('../cfg.json');
module.exports = interaction => 
    interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    || cfg.overriders.includes(interaction.user.id)
    || (interaction.channel instanceof ThreadChannel && interaction.channel.ownerId == interaction.member.id);