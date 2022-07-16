const db = require('../');
const bot = require('../../');

db.Player.prototype.getName = async function() {
    await this.getGame();
    await this.game.getChannel();
    let member;
    try {
        if (this.game.dChannel) member = await this.game.dChannel.guild.members.fetch(this.user);
    } catch(e) {}
    if (member && member.nickname) return this.name = member.nickname;
    let user;
    try {
        user = await bot.users.fetch(this.user);
    } catch(e) {}
    if (user) return this.name = user.username;
    return this.name = '???';
};