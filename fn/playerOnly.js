const db = require.main.require('./models');
const controlOnly = require('./controlOnly.js');

module.exports = async interaction => {
    let game = await controlOnly(interaction);
    if (game == null) return [null, null];
    let player = await db.Player.findOne({where: {gameId: game.id, user: interaction.user.id}});
    if (player == null) {
        await interaction.reply({content: 'Only players may use this command.', ephemeral: true});
        return [null, null];
    }
    player.game = game;
    return [game, player];
};