const db = require.main.require('./models');
const { createCanvas, loadImage } = require('canvas');

const backgroundColor = '#36393f';
const textColor = '#ffffff';
const squareSize = 100;
const gridlineSize = 5;
const fullSquareSize = squareSize+gridlineSize;
const maxHearts = 3;
const heartSize = squareSize*0.22;
const rankNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const gradientOpacity = '50'; //hex
const images = {
    logo: loadImage('./docs/battlebot.png'),
    heart: [loadImage('./heartempty.png'), loadImage('./heartfull.png'), loadImage('./heartdrop.png')],
};

db.Game.prototype.renderBoard = async function(zoomPlayer) {
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
        ctx.fillText(rankNames[x], fullSquareSize*(x+1)+(squareSize/2), squareSize/2);
    }
    for (let y = 0; y <= this.height; y++) { //horizontal grid lines
        ctx.fillRect(squareSize, squareSize+(fullSquareSize*y), fullSquareSize*this.width+gridlineSize, gridlineSize);
        ctx.fillText(y+1, squareSize/2, fullSquareSize*(y+1)+(squareSize/2));
    }

    //write tile names
    ctx.font = `${squareSize*0.3}px Arial`;
    for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.width; y++) {
            ctx.fillStyle = textColor+'88';
            ctx.fillText(`${rankNames[x]}${y+1}`, fullSquareSize*(x+1)+(squareSize/2), fullSquareSize*(y+1)+(squareSize/2));
        }
    }

    //draw players
    await this.getChannel();
    let players = await this.getPlayers();
    for (let player of players) {
        ctx.save();
        ctx.translate(fullSquareSize*(player.x+1), fullSquareSize*(player.y+1));

        //background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, squareSize, squareSize);
        let gradient = ctx.createLinearGradient(0,0,squareSize,squareSize);
        gradient.addColorStop(0, `#${player.colour1}${gradientOpacity}`);
        gradient.addColorStop(1, `#${player.colour2}${gradientOpacity}`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, squareSize, squareSize);

        //write player name
        player.game = this;
        await player.getName();
        ctx.font = `${Math.min(squareSize*0.4, squareSize*(1.25/player.name.length))}px Arial`;
        ctx.fillStyle = '#000000';
        ctx.fillText(player.name, squareSize/2, squareSize*0.2);

        //write player range
        ctx.font = `${squareSize*0.21}px Arial`;
        ctx.fillStyle = '#000000';
        ctx.fillText(`r=${player.range}`, squareSize/2, squareSize*0.5);

        //draw player hearts
        if (player.health > maxHearts) {
            let img = await images.heart[1];
            ctx.drawImage(img, (squareSize/(maxHearts+1))-(heartSize/2), squareSize*0.7, heartSize, heartSize);
            ctx.font = `${squareSize*0.21}px Arial`;
            ctx.fillStyle = '#000000';
            ctx.fillText(`x${player.health}`, (squareSize/(maxHearts+1))*2.8-(heartSize/2), squareSize*0.8);
        } else
            for (let i = 0; i < maxHearts; i++) {
                let img = await images.heart[Number(i < player.health)];
                ctx.drawImage(img, (squareSize/(maxHearts+1))*(i+1)-(heartSize/2), squareSize*0.7, heartSize, heartSize);
            }

        //draw death cross
        if (!player.alive) {
            ctx.fillStyle = '#ff0000c0';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(squareSize*0.05, 0);
            ctx.lineTo(squareSize*0.50, squareSize*0.45);
            ctx.lineTo(squareSize*0.95, 0);
            ctx.lineTo(squareSize, 0);
            ctx.lineTo(squareSize, squareSize*0.05);
            ctx.lineTo(squareSize*0.55, squareSize*0.50);
            ctx.lineTo(squareSize, squareSize*0.95);
            ctx.lineTo(squareSize, squareSize);
            ctx.lineTo(squareSize*0.95, squareSize);
            ctx.lineTo(squareSize*0.50, squareSize*0.55);
            ctx.lineTo(squareSize*0.05, squareSize);
            ctx.lineTo(0, squareSize);
            ctx.lineTo(0, squareSize*0.95);
            ctx.lineTo(squareSize*0.45, squareSize*0.50);
            ctx.lineTo(0, squareSize*0.05);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    //draw hearts
    let hearts = await db.Heart.findAll({where: {game: this.id}});
    let img = await images.heart[2];
    ctx.globalAlpha = 0.5;
    for (let heart of hearts) {
        ctx.drawImage(img, fullSquareSize*(heart.x+1), fullSquareSize*(heart.y+1), squareSize, squareSize);
    }
    ctx.globalAlpha = 1;

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