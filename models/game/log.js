const db = require('../');

db.Game.prototype.log = async function(text, showBoard=true, mentions=[]) {
    await this.getChannel();
    let msg = await this.dChannel?.send({
        content: text,
        allowedMentions: {users: mentions},
        files: showBoard ? [await this.render()] : []
    }).catch(e => {});
    if (showBoard && msg)
        await db.Board.create({game: this.id, file: msg.id});
    return msg;
};
