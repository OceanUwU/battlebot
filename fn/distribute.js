const db = require.main.require('./models');
const getVotes = require.main.require('./fn/getVotes');
const log = require.main.require('./fn/log');

const rankNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const votesPerAction = 3;

module.exports = async (game, interaction=null) => {
    let players = await db.Player.findAll({where: {game: game.id}});
    let logging = interaction == null ? 'AP distribution!\n' : `${interaction.user.username} distributed AP.\n`;
    for (let player of players) {
        let votes = await getVotes(game, player);
        let received = 1 + Math.floor(votes/votesPerAction);
        await db.Player.update({actions: player.actions+received}, {where: {id: player.id}});
        logging += `\n<@${player.user}>: +${received} AP (${votes} votes)`;
    }
    if (game.heartDrops) {
        let hearts = await db.Heart.findAll({where: {game: game.id}});
        let takenSpaces = [...players, ...hearts].map(t => [t.x, t.y]);
        let emptySpaces = [].concat.apply([], Array(20).fill(null).map((e, i) => Array(12).fill(null).map((e2, i2) => [i, i2])))
            .filter(space => takenSpaces.find(s => s[0] == space[0] && s[1] == space[1]) == undefined);
        if (emptySpaces.length > 0) {
            let space = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
            await db.Heart.create({game: game.id, x: space[0], y: space[1]});
            logging += `\n\nHeart spawned at ${rankNames[space[0]]}${space[1]+1}!`;
        }
    }
    await log(game, logging);
};