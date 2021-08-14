const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');

module.exports = {
    name: 'board',
    description: 'Displays the current board to you only.',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;
        let logChannel = await interaction.guild.channels.fetch(game.logChannel);
        let msg = (await logChannel.messages.fetch({limit: 1})).first();
        if (msg && msg.attachments.first())
        await interaction.reply({content: msg.attachments.first().url, ephemeral: true});
    }
};