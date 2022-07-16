const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');

module.exports = async interaction => {
    let game = await controlOnly(interaction);
    if (game == null) return;
    let player = await db.Player.findOne({where: {game: game.id, user: interaction.user.id}});
    if (player == null)
        return interaction.reply({ephemeral: true, content: 'Only players may use this command!'});

    let vote = interaction.values[0];
    if (vote == 'null')
        vote = null;
    else
        vote = Number(vote);
    await db.Player.update({vote}, {where: {id: player.id}});
    let content;
    if (vote == null) {
        content = 'You removed your vote.';
    } else {
        let votedPlayer = await db.Player.findOne({where: {id: vote}});
        content = `You voted for <@${votedPlayer.user}>.`;
    }
    await interaction.update({content, components: []});
};