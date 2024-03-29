const { Op } = require("sequelize");
const db = require.main.require('./models');

const getSpace = spaces => spaces.splice(Math.floor(Math.random() * spaces.length), 1)[0];

db.Game.prototype.distribute = async function(interaction=null) {
    let players = await this.getPlayers();
    let logging = interaction == null ? 'AP distribution!\n' : `${interaction.user.username} distributed AP.\n\n`;

    //distribute ap
    let highestVotes = 0;
    let haunted = null;
    for (let player of players.filter(p => p.alive)) {
        player.votes = await player.getVotes();
        if (player.votes == highestVotes)
            haunted = null;
        else if (player.votes > highestVotes) {
            highestVotes = player.votes;
            haunted = player.user;
        }
    }

    for (let player of players.filter(p => p.alive)) {
        let received = (this.votesneeded == -1 && player.user == haunted ? 0 : 1) + (this.votesneeded > 0 ? Math.floor(player.votes/this.votesneeded) : 0);
        await player.increment('actions', {by: received});
        logging += `<@${player.user}>: +${received} AP${player.votes > 0 ? ` (${player.votes} votes)` : ''}\n`;
    }
    
    //generate drops
    await db.Heart.destroy({where: {game: this.id, type: {[Op.or]: [3, 4]}}});
    let drops = await db.Heart.findAll({where: {game: this.id, type: {[Op.not]: 5}}});
    let spikes = await db.Heart.findAll({where: {game: this.id, type: 5}});
    let takenSpaces = [...players, ...drops].map(t => [t.x, t.y]);
    let spikeSpaces = [...players, ...spikes.filter(s => !players.some(p => p.x == s.x && p.y == s.y))].map(t => [t.x, t.y]);
    let emptySpaces = [].concat.apply([], Array(this.width).fill(null).map((e, i) => Array(this.height).fill(null).map((e2, i2) => [i, i2])))
        .filter(space => takenSpaces.find(s => s[0] == space[0] && s[1] == space[1]) == undefined);
    let spikelessSpaces = [].concat.apply([], Array(this.width).fill(null).map((e, i) => Array(this.height).fill(null).map((e2, i2) => [i, i2])))
        .filter(space => spikeSpaces.find(s => s[0] == space[0] && s[1] == space[1]) == undefined);
    if (this.heartDrops && emptySpaces.length > 0) {
        let space = getSpace(emptySpaces);
        await db.Heart.create({game: this.id, type: 0, x: space[0], y: space[1]});
        logging += `\nHeart spawned at ${db.Game.tileName(space[0], space[1])}.`;
    }
    if (this.batteryDrops && emptySpaces.length > 0) {
        let space = getSpace(emptySpaces);
        await db.Heart.create({game: this.id, type: 1, x: space[0], y: space[1]});
        logging += `\nBattery spawned at ${db.Game.tileName(space[0], space[1])}.`;
    }
    if (this.rangeDrops && emptySpaces.length > 0) {
        let space = getSpace(emptySpaces);
        await db.Heart.create({game: this.id, type: 2, x: space[0], y: space[1]});
        logging += `\nRange buff spawned at ${db.Game.tileName(space[0], space[1])}.`;
    }
    if (this.spikeDrops && spikelessSpaces.length > 0 && spikes.length < 25) {
        let space = getSpace(spikelessSpaces);
        await db.Heart.create({game: this.id, type: 5, x: space[0], y: space[1]});
        logging += `\nSpike spawned at ${db.Game.tileName(space[0], space[1])}.`;
    }
    if (this.portalDrops && emptySpaces.length > 1) {
        let spaces = [];
        for (let i = 0; i < 2; i++) {
            let space = getSpace(emptySpaces);
            await db.Heart.create({game: this.id, type: 3, x: space[0], y: space[1]});
            spaces.push(space);
        }
        logging += `\nThe Portal linked ${db.Game.tileName(spaces[0][0], spaces[0][1])} and ${db.Game.tileName(spaces[1][0], spaces[1][1])}.`;
    }
    if (this.blackHoleDrops && emptySpaces.length > 0) {
        let space = getSpace(emptySpaces);
        await db.Heart.create({game: this.id, type: 4, x: space[0], y: space[1]});
        logging += `\nBlack hole moved to ${db.Game.tileName(space[0], space[1])}.`;
    }

    //announce
    await this.log(logging, true, players.map(p => p.user));
};