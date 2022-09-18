const db = require.main.require('./models');
const { createCanvas, loadImage } = require('canvas');

const size = 100;
const maxHearts = 3;
const heartSize = size*0.22;
const gradientOpacity = '50'; //hex
const images = {
    heart: [loadImage('./heartempty.png'), loadImage('./heartfull.png')],
    icons: {
        white: loadImage('./icons/white.png'),
        black: loadImage('./icons/white.png'),
        battlebot: loadImage('./icons/battlebot.png'),
        player: loadImage('./icons/player.png'),
        first: loadImage('./icons/first.png'),
        second: loadImage('./icons/second.png'),
        third: loadImage('./icons/third.png'),
        sharer: loadImage('./icons/groupwin.png'),
        skull: loadImage('./icons/death.png'),
        clock: loadImage('./icons/clock.png'),
        dev: loadImage('./icons/dev.png'),
    },
};
const crossPoints = [
    [size*0.05, 0],
    [size*0.50, size*0.45],
    [size*0.95, 0],
    [size, 0],
    [size, size*0.05],
    [size*0.55, size*0.50],
    [size, size*0.95],
    [size, size],
    [size*0.95, size],
    [size*0.50, size*0.55],
    [size*0.05, size],
    [0, size],
    [0, size*0.95],
    [size*0.45, size*0.50],
    [0, size*0.05],
];

db.Player.prototype.render = async function() {
    //create canvas
    let canvas = createCanvas(size, size);
    let ctx = canvas.getContext('2d');

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    //background
    await this.getConfig();
    ctx.drawImage(await images.icons[this.config.image], 0, 0, size, size);
    switch (this.config.style) {
        case 'diagonal':
            ctx.fillStyle = ctx.createLinearGradient(0, 0, size, size);
            ctx.fillStyle.addColorStop(0, `#${this.config.colour1}${gradientOpacity}`);
            ctx.fillStyle.addColorStop(1, `#${this.config.colour2}${gradientOpacity}`);
            ctx.fillStyle = ctx.fillStyle;
            ctx.fillRect(0, 0, size, size);
            break;

        case 'circle':
            ctx.fillStyle = ctx.createRadialGradient(size/2, size/2, size/10, size/2, size/2, size*0.71);
            ctx.fillStyle.addColorStop(0, `#${this.config.colour1}${gradientOpacity}`);
            ctx.fillStyle.addColorStop(1, `#${this.config.colour2}${gradientOpacity}`);
            ctx.fillRect(0, 0, size, size);
            break;

        case 'waves':
            ctx.fillStyle = ctx.createRadialGradient(size/2, size/2, size/10, size/2, size/2, size*1.25);
            for (let i = 0.2; i < 1.2; i += 0.2) {
                ctx.fillStyle.addColorStop(i, `#${this.config.colour1}${gradientOpacity}`);
                ctx.fillStyle.addColorStop(i+0.1, `#${this.config.colour2}${gradientOpacity}`);
            }
            ctx.fillRect(0, 0, size, size);
            break;

        case 'stripes':
            ctx.fillStyle = ctx.createLinearGradient(20, -20, 0, size);
            for (let i = -0.3; i < 1.2; i += 0.3) {
                ctx.fillStyle.addColorStop(i, `#${this.config.colour1}${gradientOpacity}`);
                ctx.fillStyle.addColorStop(i+0.15, `#${this.config.colour2}${gradientOpacity}`);
            }
            break;

        case 'none':
            ctx.fillStyle = 'transparent';
            break;
    }
    ctx.fillRect(0, 0, size, size);
    
    //write player name
    let name = this.name.slice(0, 10).trim();
    ctx.font = `${Math.min(size*0.4, size*(1.25/name.length))}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.fillText(name, size/2, size*0.2);

    //write player range
    ctx.font = `${size*0.21}px Arial`;
    ctx.fillText(`r=${this.range}`, size/2, size*0.5);

    //draw player hearts
    if (this.health > maxHearts) {
        ctx.drawImage(await images.heart[1], size*0.2, size*0.7, heartSize, heartSize);
        ctx.font = `${size*0.21}px Arial`;
        ctx.fillText(`x${this.health}`, (size/(maxHearts+1))*2.8-(heartSize/2), size*0.8);
    } else
        for (let i = 0; i < maxHearts; i++)
            ctx.drawImage(await images.heart[Number(i < this.health)], (size/(maxHearts+1))*(i+1)-(heartSize/2), size*0.7, heartSize, heartSize);
    
    if (this.config.image == 'black') {
        ctx.globalCompositeOperation='difference';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        ctx.globalCompositeOperation = 'source-over';
    }

    //draw death cross
    if (!this.alive) {
        ctx.fillStyle = '#ff0000c0';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let i of crossPoints)
            ctx.lineTo(i[0], i[1]);
        ctx.closePath();
        ctx.fill();
    }

    return canvas;
}