const db = require('../');
const bot = require('../../');

db.Game.prototype.getChannel = async function() {
    if (!this.dChannel)
        this.dChannel = await bot.channels.fetch(this.channel).catch(e => {});
};