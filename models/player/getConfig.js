const db = require('../');
const randomColour = require.main.require('./fn/randomColour.js');

db.Player.prototype.getConfig = async function() {
    if (!this.hasOwnProperty('config')) {
        this.config = await db.User.findOne({where: {id: this.user}});
        if (this.config == null) {
            this.config = await db.User.create({
                id: this.user,
                colour1: randomColour(),
                colour2: randomColour(),
                style: 'diagonal',
                image: 'white',
            });
        }
    }
};