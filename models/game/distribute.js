const db = require.main.require('./models');

const votesPerAction = 3;

db.Game.prototype.distribute = async function(interaction=null) {
    let players = await this.getPlayers();
    let logging = interaction == null ? 'AP distribution!\n' : `${interaction.user.username} distributed AP.\n`;
    for (let player of players.filter(p => p.alive)) {
        let votes = await player.getVotes();
        let received = 1 + Math.floor(votes/votesPerAction);
        await player.increment('actions', {by: received});
        logging += `\n<@${player.user}>: +${received} AP${votes > 0 ? ` (${votes} votes)` : ''}`;
    }
    if (this.heartDrops) {
        let hearts = await db.Heart.findAll({where: {game: this.id}});
        let takenSpaces = [...players, ...hearts].map(t => [t.x, t.y]);
        let emptySpaces = [].concat.apply([], Array(this.width).fill(null).map((e, i) => Array(this.height).fill(null).map((e2, i2) => [i, i2])))
            .filter(space => takenSpaces.find(s => s[0] == space[0] && s[1] == space[1]) == undefined);
        if (emptySpaces.length > 0) {
            let space = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
            await db.Heart.create({game: this.id, x: space[0], y: space[1]});
            logging += `\n\nHeart spawned at ${db.Game.tileName(space[0], space[1])}!`;
        }
    }
    await this.log(logging, true, players.map(p => p.user));
};