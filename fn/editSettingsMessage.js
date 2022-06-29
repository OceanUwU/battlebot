const db = require.main.require('./models');
const pointRates = require('../consts/pointRates');

module.exports = async (game, msg) => {
    await msg.edit({content: `${msg.content.split('\n')[0]}\n\nAP distribution interval: ${pointRates.find(pr => pr[1] == game.pointRate)[0]}\nHeart drops: ${game.heartDrops ? 'on' : 'off'}`});
};