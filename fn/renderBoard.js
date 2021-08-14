const db = require.main.require('./models');
const { createCanvas, loadImage } = require('canvas');
const bot = require('../');

const squareSize = 100;
const gridlineSize = 5;
const fullSquareSize = squareSize+gridlineSize;
const boardWidth = 20;
const boardHeight = 12;
const maxHearts = 3;
const heartSize = squareSize*0.22;
const rankNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const gradientOpacity = '50'; //hex
const images = {
    logo: loadImage('./docs/iconSmall.png'),
    heart: [loadImage('./heartempty.png'), loadImage('./heartfull.png')],
};

async function render(game, zoomPlayer) {
    //create canvas
    let canvas = createCanvas(fullSquareSize*boardWidth+fullSquareSize, fullSquareSize*boardHeight+fullSquareSize);
    let ctx = canvas.getContext('2d');

    //background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw logo
    ctx.drawImage(await images.logo, 0, 0, squareSize, squareSize);

    //draw grid lines + rank/file names
    ctx.font = `${squareSize*0.7}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';
    for (let x = 0; x <= boardWidth; x++) { //vertical grid lines
        ctx.fillRect(squareSize+(fullSquareSize*x), squareSize, gridlineSize, fullSquareSize*boardHeight+gridlineSize);
        ctx.fillText(rankNames[x], fullSquareSize*(x+1)+(squareSize/2), squareSize/2);
    }
    for (let y = 0; y <= boardHeight; y++) { //horizontal grid lines
        ctx.fillRect(squareSize, squareSize+(fullSquareSize*y), fullSquareSize*boardWidth+gridlineSize, gridlineSize);
        ctx.fillText(y+1, squareSize/2, fullSquareSize*(y+1)+(squareSize/2));
    }

    //write tile names
    ctx.font = `${squareSize*0.3}px Arial`;
    for (let x = 0; x < boardWidth; x++) {
        for (let y = 0; y < boardWidth; y++) {
            ctx.fillStyle = '#cccccc';
            ctx.fillText(`${rankNames[x]}${y+1}`, fullSquareSize*(x+1)+(squareSize/2), fullSquareSize*(y+1)+(squareSize/2));
        }
    }

    //draw players
    let players = await db.Player.findAll({where: {game: game.id}});
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
        let user = await bot.users.fetch(player.user);
        ctx.font = `${squareSize*(1.25/user.username.length)}px Arial`;
        ctx.fillStyle = '#000000';
        ctx.fillText(user.username, squareSize/2, squareSize*0.2);

        //write player range
        ctx.font = `${squareSize*0.21}px Arial`;
        ctx.fillStyle = '#000000';
        ctx.fillText(`r=${player.range}`, squareSize/2, squareSize*0.5);

        //draw player hearts
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

    if (zoomPlayer)
        canvas = zoom(canvas, zoomPlayer);

    return canvas.toBuffer('image/png');
}

function zoom(board, player) {
    let size = (fullSquareSize*(player.range*2+1))+gridlineSize;
    let canvas = createCanvas(size, size);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(board, -(fullSquareSize*(player.x-player.range)+squareSize), -(fullSquareSize*(player.y-player.range)+squareSize), board.width, board.height);
    return canvas;
}

module.exports = render;