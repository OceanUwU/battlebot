const bot = require.main.require('./');
const db = require.main.require('./models');

db.Game.prototype.editPlayerList = async function() {
    let players = await this.getPlayers();
    await (await (await bot.channels.fetch(this.channel))?.messages.fetch(this.joinMenu))?.edit(`Players (${players.length}/${25}):\n\n${players.map(p => `<@${p.user}>`).join('\n')}`);
};