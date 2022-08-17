const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = new ContextMenuCommandBuilder()
    .setName('c')
    .setType(ApplicationCommandType.User);