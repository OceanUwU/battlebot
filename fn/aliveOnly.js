const db = require.main.require('./models');
const controlOnly = require('./controlOnly.js');

async function aliveOnly(interaction) {
    let game = await controlOnly(interaction);
    if (game == null) return [null, null];
    let player = await db.Player.findOne({where: {game: game.id, user: interaction.user.id}});
    if (player == null || !player.alive) {
        await interaction.reply({content: 'Only alive players may use this command.', ephemeral: true});
        return [null, null];
    }
    return [game, player];
}

module.exports = aliveOnly;