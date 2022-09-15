const db = require.main.require('./models');
const bot = require.main.require('./');
const cfg = require.main.require('./cfg.json');
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');
const imgbbUploader = require('imgbb-uploader');

async function giveBackground(player, background) {
    let user;
    try {
        user = await bot.users.fetch(player.user);
    } catch(e) {}
    if (!user) return;
    if (await db.Image.count({where: {user: user.id, name: background}}) == 0) {
        db.Image.create({user: user.id, name: background});
        user.send(`You've earned the \`${background[0].toUpperCase()}${background.slice(1)}\` background! Use **/customise** to equip it.`);
    }
}

async function createGif(boards, endMessage, gameId) {
    try {
        let files = boards.map(board => `https://cdn.discordapp.com/attachments/${endMessage.channel.id}/${board.file}/file.jpg`).map(fileName => loadImage(fileName));
        await files[0];
        let sizes = [(await files[0]).width, (await files[0]).height];
        let encoder = new GIFEncoder(sizes[0], sizes[1]);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(500);
        encoder.setQuality(1);
        let canvas = createCanvas(sizes[0], sizes[1]);
        let ctx = canvas.getContext('2d');
        for (let file of files) {
            ctx.drawImage(await file, 0, 0);
            encoder.addFrame(ctx);
        }
        encoder.finish();
    
        endMessage.channel.send((await imgbbUploader({
            apiKey: cfg.imgbbkey,
            base64string: encoder.out.getData().toString('base64'),
            fileName: `bb-game${gameId}-history.gif`
        })).url);
    } catch (e) {
        console.error(e);
    }
}

db.Game.prototype.end = async function() {
    let winners = await this.getPlayers({alive: true});
    let losers = await db.Player.findAll({order: [['deathTime', 'DESC']], where: {gameId: this.id, alive: false}});
    let endMessage = await this.log(`GAME OVER! ${winners.length > 1 ? `${winners.slice(0, winners.length-1).map(p => `<@${p.user}>`).join(', ')} and <@${winners[winners.length-1].user}>` : `<@${winners[0].user}>`} WON!\n\nFinal standings:${winners.map(p => `\n1: <@${p.user}> (${p.actions} AP left over)`)}${losers.map((p,i) => `\n${winners.length+i+1}: <@${p.user}>`).join('')}\n\nFinal board:`, true, [...winners, ...losers].map(p => p.user));
    //give out backgrounds
    if (this.channel == cfg.mainChannel) {
        for (let player of [...winners, ...losers])
            giveBackground(player, 'player');
        if (winners.length > 1) {
            for (let winner of winners)
                giveBackground(winner, 'sharer');
            if (winners.length == 2 && losers.length > 0)
                giveBackground(losers[0], 'third');
        } else if (winners.length == 1) {
            giveBackground(winners[0], 'first');
            if (losers.length > 0) 
                giveBackground(losers[0], 'second');
            if (losers.length > 1)
                giveBackground(losers[1], 'third');
        }
        if (losers.length > 0) 
            giveBackground(losers[losers.length-1], 'skull');
    } else if (this.channel == cfg.quikChannel)
        giveBackground(winners[0], 'clock');
    createGif(await db.Board.findAll({where: {game: this.id}, order: [['createdAt', 'ASC']]}), endMessage, this.id);
    //delete game
    await db.Player.destroy({where: {gameId: this.id}});
    await db.Heart.destroy({where: {game: this.id}});
    await db.Board.destroy({where: {game: this.id}});
    await this.destroy();
    await endMessage.pin().catch(e => {});
};