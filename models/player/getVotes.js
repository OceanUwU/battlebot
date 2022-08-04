const db = require.main.require('./models');

db.Player.prototype.getVotes = async function() {    
    return db.Player.count({where: {
        gameId: this.gameId,
        alive: false,
        vote: this.id,
    }});
};