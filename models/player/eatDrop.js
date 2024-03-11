const { Op } = require('sequelize');
const db = require('../');

const spikeDamage = 1;

db.Player.prototype.eatDrop = async function() {
    let drop = await db.Heart.findOne({where: {game: this.game.id, x: this.x, y: this.y}});
    if (drop == null) return '';
    if (drop.type != 5) //if not spikes
        await drop.destroy();
    switch (drop.type) {
        case 0:
            await this.increment('health');
            await this.update({alive: true});
            return `They picked up a heart and healed to ${this.health+1} health.`;
        case 1:
            await this.increment('actions', {by: 3});
            return `They ate a battery and gained ${3} AP.`;
        case 2:
            await this.increment('range');
            return `They picked up a range buff, increasing their range to ${this.range+1}.`;
        case 3:
            let exit = await db.Heart.findOne({where: {game: this.game.id, type: 3, id: {[Op.not]: drop.id}}});
            await exit.destroy();
            await this.update({x: exit.x, y: exit.y});
            return `They stepped into the portal and got transported to ${db.Game.tileName(exit.x, exit.y)}. The portal closed.`;
        case 4:
            if (this.alive) {
                await this.update({health: 0, alive: false, deathTime: Date.now()});
                if ((await db.Player.count({where: {gameId: this.game.id, alive: true}})) <= 1)
                    this.game.end();
                return 'They fell into the black hole and died. The black hole closed.';
            } else return 'They moved into the black hole, but they\'re already dead! The black hole closed.';
        case 5:
            if (this.alive) {
                await this.update({health: this.health - spikeDamage, alive: this.health > spikeDamage, deathTime: Date.now()});
                if ((await db.Player.count({where: {gameId: this.game.id, alive: true}})) <= 1)
                    this.game.end();
                return this.health > spikeDamage ? 'They fell into spikes and lost 1 health.' : 'They fell into spikes and died!';
            } else return 'They moved into spikes.';
    }
};
