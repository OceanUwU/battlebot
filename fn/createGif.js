const Gif = import('make-a-gif');
const { createCanvas, loadImage } = require('canvas');
const { messageLink } = require('discord.js');
const imgbbUploader = require('imgbb-uploader');
const cfg = require.main.require('./cfg.json');

module.exports = async (boards, endMessage, gameId) => {
    try {
        let encoder;
        boards = boards.map(board => `https://cdn.discordapp.com/attachments/${endMessage.channel.id}/${board.file}/file.jpg`);
        for (let board of boards) {
            let img = await loadImage(board);
            let canvas = createCanvas(img.width/2, img.width/2);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            if (encoder == undefined)
                encoder = new (await Gif).Gif(canvas.width, canvas.height, 75);
            await encoder.addFrame({src: canvas.toBuffer()});
        }
        await endMessage.edit({
            content: endMessage.content.replace('(generating gif...)', (await imgbbUploader({
                apiKey: cfg.imgbbkey,
                base64string: (await encoder.encode()).toString('base64'),
                filename: `bb-game${gameId}-history.gif`
            })).url)
        });
    } catch (e) {
        console.error(e);
    }
};