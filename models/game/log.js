const db = require('../');

db.Game.prototype.log = async function(text, showBoard=true, mentions=[]) {
    await this.getChannel();
    return await this.dChannel?.send({
        content: text,
        allowedMentions: {users: mentions},
        files: showBoard ? [await this.renderBoard()] : []
    }).catch(e => {});
};