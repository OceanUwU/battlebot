const { Op } = require('sequelize');
const db = require('../');

const spikeDamage = 1;

db.Player.prototype.eatDrop = async function() {
    let resultText = '';
    let drops = await db.Heart.findAll({where: {game: this.game.id, x: this.x, y: this.y}});
    drops.sort((a, b) => {if (a.type < b.type) return -1; else if (a.type > b.type) return 1; return 0;});
    for (let drop of drops) {
        if (drop == null) break;
        if (drop.type != 5) //if not spikes
            await drop.destroy();
        switch (drop.type) {
            case 0:
                await this.increment('health');
                await this.update({alive: true});
                resultText += `\nThey picked up a heart and healed to ${++this.health} health.`;
                break;
            case 1:
                await this.increment('actions', {by: 3});
                resultText += `\nThey ate a battery and gained ${3} AP.`;
            case 2:
                await this.increment('range');
                resultText += `\nThey picked up a range buff, increasing their range to ${this.range+1}.`;
            case 3:
                let exit = await db.Heart.findOne({where: {game: this.game.id, type: 3, id: {[Op.not]: drop.id}}});
                await exit.destroy();
                await this.update({x: exit.x, y: exit.y});
                resultText += `\nThey stepped into the portal and got transported to ${db.Game.tileName(exit.x, exit.y)}. The portal closed.`;
                resultText += this.eatDrop();
            case 4:
                if (this.alive) {
                    await this.update({health: 0, alive: false, deathTime: Date.now()});
                    if ((await db.Player.count({where: {gameId: this.game.id, alive: true}})) <= 1)
                        this.game.end();
                    resultText += '\nThey fell into the black hole and died. The black hole closed.';
                } else resultText += '\nThey moved into the black hole, but they\'re already dead! The black hole closed.';
            case 5:
                if (this.alive) {
                    await this.update({health: this.health - spikeDamage, alive: this.health > spikeDamage, deathTime: Date.now()});
                    if ((await db.Player.count({where: {gameId: this.game.id, alive: true}})) <= 1)
                        this.game.end();
                        resultText += this.health > spikeDamage ? '\nThey fell into spikes and lost 1 health.' : '\nThey fell into spikes and died!';
                } else resultText += '\nThey moved onto spikes.';
        }
    }
    return resultText;
};
