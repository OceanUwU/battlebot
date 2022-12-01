const db = require.main.require('./models');
const { createCanvas, loadImage } = require('canvas');
const bot = require('../../');

const size = 100;
const maxHearts = 3;
const heartSize = size*0.22;
const images = {
    heart: [loadImage('./heartempty.png'), loadImage('./heartfull.png')],
    icons: {
        none: loadImage('./icons/white.png'),
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
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,size,size);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    //background
    await this.getConfig();
    if (this.config.image == "avatar") {
        ctx.globalAlpha = 0.6;
        let user = await bot.users.fetch(this.user);
        if (user)
            ctx.drawImage(await loadImage(user.displayAvatarURL({size:128}).replace('webp','png')), 0, 0, 100, 100);
        ctx.globalAlpha = 1;
    } else
        ctx.drawImage(await images.icons[this.config.image], 0, 0, size, size);

    //overlay
    let canvasO = createCanvas(size, size);
    let ctxO = canvasO.getContext('2d');
    let tc1 = `#${this.config.colour1}`;
    let tc2 = `#${this.config.colour2}`;
    switch (this.config.style) {
        case 'diagonal':
            ctxO.fillStyle = ctxO.createLinearGradient(0, 0, size, size);
            ctxO.fillStyle.addColorStop(0, tc1);
            ctxO.fillStyle.addColorStop(1, tc2);
            ctxO.fillStyle = ctxO.fillStyle;
            ctxO.fillRect(0, 0, size, size);
            break;

        case 'radial':
            ctxO.fillStyle = ctxO.createRadialGradient(size/2, size/2, size/10, size/2, size/2, size*0.71);
            ctxO.fillStyle.addColorStop(0, tc1);
            ctxO.fillStyle.addColorStop(1, tc2);
            ctxO.fillRect(0, 0, size, size);
            break;

        case 'waves':
            ctxO.fillStyle = ctxO.createRadialGradient(size/2, size/2, size/10, size/2, size/2, size*1.25);
            for (let i = 0.2; i < 1.2; i += 0.2) {
                ctxO.fillStyle.addColorStop(i, tc1);
                ctxO.fillStyle.addColorStop(i+0.1, tc2);
            }
            ctxO.fillRect(0, 0, size, size);
            break;

        case 'stripes':
            ctxO.fillStyle = ctxO.createLinearGradient(20, -20, 0, size);
            for (let i = -0.3; i < 1.2; i += 0.3) {
                ctxO.fillStyle.addColorStop(i, tc1);
                ctxO.fillStyle.addColorStop(i+0.15, tc2);
            }
            ctxO.fillRect(0, 0, size, size);
            break;
        
        case "circles":
            for (let x = 0; x < 4; x++)
                for (let y = 0; y < 4; y++) {
                    let inv = Boolean(hash(y*4+x+50)%2);
                    ctxO.translate(x*25,y*25);
                    ctxO.fillStyle = inv ? tc1 : tc2;
                    ctxO.fillRect(0,0,25,25);
                    ctxO.fillStyle = inv ? tc2 : tc1;
                    switch (hash(y*4+x) % 3) {
                        case 0:
                            ctxO.beginPath();
                            ctxO.arc(12.5, 12.5, 12.5, 0, 2*Math.PI);
                            ctxO.fill();
                            break;
                        case 1:
                            ctxO.translate(25,0);
                            ctxO.rotate(0.5*Math.PI);
                        case 2:
                            ctxO.beginPath();
                            ctxO.arc(12.5, 0, 12.5, 0, Math.PI);
                            ctxO.fill();
                            ctxO.beginPath();
                            ctxO.arc(12.5, 25, 12.5, Math.PI, 2*Math.PI);
                            ctxO.fill();
                            break;
                    }
                    ctxO.resetTransform();
                }
            break;
        
        case "hexagonal":
            let a = 2 * Math.PI / 6;
            let r = 10;
            for (let y = -5; y < 105; y += r * Math.sin(a)) {
                for (let x = -5, j = 0; x<120; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
                    ctxO.fillStyle=hash(Math.floor(x*y))%2 ? tc1 : tc2;
                    ctxO.beginPath();
                    for (let i = 0; i < 6; i++) {
                        ctxO.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
                    }
                    ctxO.closePath();
                    ctxO.fill();
                }
            }
            break;
        
        case "peaks":
            ctxO.fillStyle=tc2;
            ctxO.fillRect(0,0,size,size);
            ctxO.fillStyle=tc1;
            for (let x = 4; x < size; x+=8) {
                let y = Math.sin(2*Math.PI*(x+(4/2))/size)*size/2;
                ctxO.fillRect(x,y,4,100);
            }
            break;
        
        case "spiral":
            let sA = 0;
            for (let sR = 0; sR < 0.75*95; sR+=0.75) {
                sA += (Math.PI * 2) / 50;
                var x = size / 2 + sR * Math.cos(sA);
                var y = size / 2 + sR * Math.sin(sA);
                ctxO.lineTo(x, y);
            }
            ctxO.fillStyle=tc1;
            ctxO.fillRect(0,0,size,size);
            ctxO.strokeStyle=tc2;
            ctxO.lineWidth=20;
            ctxO.stroke();
            break;

        case 'none':
            break;
    }
    ctx.globalAlpha = 0.35;
    ctx.drawImage(canvasO,0,0);
    ctx.globalAlpha = 1;
    
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
    
    if (this.config.inverted) {
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

function hash(a) {
    a = (a ^ 61) ^ (a >> 16);
    a = a + (a << 3);
    a = a ^ (a >> 4);
    a = a * 0x27d4eb2d;
    return a ^ (a >> 15);
}
