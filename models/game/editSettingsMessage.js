const db = require.main.require('./models');
const pointRates = require('../../consts/pointRates');

db.Game.prototype.editSettingsMessage = async function(msg) {
    await msg.edit({content: `${msg.content.split('\n')[0]}\n\nBoard size: ${this.width}x${this.height}\nAP distribution interval: ${pointRates.find(pr => pr[1] == this.pointRate)[0]}\nHeart drops: ${this.heartDrops ? 'on' : 'off'}\nStarting hearts: ${this.startingHearts}\nStarting range: ${this.startingRange}`});
};