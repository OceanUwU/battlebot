const renderBoard = require('./renderBoard');
const bot = require('../');

async function log(game, text, showBoard=true) {
    let channel = await bot.channels.fetch(game.channel);
    await channel.send({content: text, files: showBoard ? [await renderBoard(game)] : []});
}

module.exports = log;