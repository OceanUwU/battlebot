const db = require.main.require('./models');

async function controlOnly(interaction) {
    let game = await db.Game.findOne({where: {channel: interaction.channelId, started: true}});
    if (game == null) {
        await interaction.reply({content: 'This command can only be used in the control channel of a Battlebot game!', ephemeral: true});
        return null;
    }
    return game;
}

module.exports = controlOnly;