const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');
const imgbbUploader = require('imgbb-uploader');
const cfg = require.main.require('./cfg.json');

module.exports = async (boards, endMessage, gameId) => {
    try {
        let files = boards.map(board => `https://cdn.discordapp.com/attachments/${endMessage.channel.id}/${board.file}/file.jpg`).map(fileName => loadImage(fileName));
        await files[0];
        let sizes = [(await files[0]).width/2, (await files[0]).height/2];
        let encoder = new GIFEncoder(sizes[0], sizes[1]);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(500);
        encoder.setQuality(1);
        let canvas = createCanvas(sizes[0], sizes[1]);
        let ctx = canvas.getContext('2d');
        let n = 0;
        let addFrame = async () => {
            if (files.hasOwnProperty(n)) {
                ctx.drawImage(await files[n++], 0, 0, sizes[0], sizes[1]);
                encoder.addFrame(ctx);
                setTimeout(addFrame, 500);
            } else
                finish();
        }
        let finish = async () => {
            encoder.finish();
            endMessage.reply((await imgbbUploader({
                apiKey: cfg.imgbbkey,
                base64string: encoder.out.getData().toString('base64'),
                fileName: `bb-game${gameId}-history.gif`
            })).url);
        }
        addFrame();
    } catch (e) {
        console.error(e);
    }
};