const db = require.main.require('./models');

async function controlOnly(interaction) {
    let game = await db.Game.findOne({where: {commandChannel: interaction.channelId}});
    if (game == null) {
        await interaction.reply({content: 'This command can only be used in the control channel of a Devious Disposition game!', ephemeral: true});
        return null;
    }
    return game;
}

module.exports = controlOnly;