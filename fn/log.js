const renderBoard = require('./renderBoard');
const bot = require('../');

async function log(game, text, showBoard=true) {
    let logChannel = await bot.channels.fetch(game.logChannel);
    await logChannel.send({content: text, files: showBoard ? [await renderBoard(game)]: []});
}

module.exports = log;