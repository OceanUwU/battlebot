const db = require.main.require('./models');
const { createCanvas, loadImage } = require('canvas');

const backgroundColor = '#36393f';
const textColor = '#ffffff';
const squareSize = 100;
const gridlineSize = 5;
const fullSquareSize = squareSize+gridlineSize;
const rankNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const images = {
    logo: loadImage('./docs/battlebot.png'),
    drops: [loadImage('./heartdrop.png'), loadImage('./battery.png'), loadImage('./range.png'), loadImage('./portal.png'), loadImage('./blackhole.png')]
};

db.Game.prototype.render = async function(zoomPlayer) {
    //create canvas
    let canvas = createCanvas(fullSquareSize*this.width+fullSquareSize, fullSquareSize*this.height+fullSquareSize);
    let ctx = canvas.getContext('2d');

    //background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw logo
    ctx.drawImage(await images.logo, 0, 0, squareSize, squareSize);

    //draw grid lines + rank/file names
    ctx.font = `${squareSize*0.7}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    for (let x = 0; x <= this.width; x++) { //vertical grid lines
        ctx.fillRect(squareSize+(fullSquareSize*x), squareSize, gridlineSize, fullSquareSize*this.height+gridlineSize);
        if (x < this.width)
            ctx.fillText(rankNames[x], fullSquareSize*(x+1)+(squareSize/2), squareSize/2);
    }
    for (let y = 0; y <= this.height; y++) { //horizontal grid lines
        ctx.fillRect(squareSize, squareSize+(fullSquareSize*y), fullSquareSize*this.width+gridlineSize, gridlineSize);
        if (y < this.height)
            ctx.fillText(y+1, squareSize/2, fullSquareSize*(y+1)+(squareSize/2));
    }

    //write tile names
    ctx.font = `${squareSize*0.3}px Arial`;
    for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
            ctx.fillStyle = textColor+'88';
            ctx.fillText(db.Game.tileName(x, y), fullSquareSize*(x+1)+(squareSize/2), fullSquareSize*(y+1)+(squareSize/2));
        }
    }

    //draw players
    await this.getChannel();
    let players = await this.getPlayers();
    for (let player of players)
        ctx.drawImage(await player.render(), fullSquareSize*(player.x+1), fullSquareSize*(player.y+1));

    //draw drops
    let drops = await db.Heart.findAll({where: {game: this.id}});
    for (let drop of drops)
        ctx.drawImage(await images.drops[drop.type], fullSquareSize*(drop.x+1), fullSquareSize*(drop.y+1), squareSize, squareSize);

    if (zoomPlayer)
        canvas = zoom(canvas, zoomPlayer);

    return canvas.toBuffer('image/png');
};

function zoom(board, player) {
    let size = (fullSquareSize*(player.range*2+1))+gridlineSize;
    let canvas = createCanvas(size, size);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(board, -(fullSquareSize*(player.x-player.range)+squareSize), -(fullSquareSize*(player.y-player.range)+squareSize), board.width, board.height);
    return canvas;
}