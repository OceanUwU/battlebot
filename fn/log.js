const renderBoard = require('./renderBoard');
const bot = require('../');

async function log(game, text, showBoard=true, mentions=[]) {
    let channel = await bot.channels.fetch(game.channel).catch(e => {});
    await channel?.send({content: text, allowedMentions: {users: mentions}, files: showBoard ? [await renderBoard(game)] : []});
}

module.exports = log;