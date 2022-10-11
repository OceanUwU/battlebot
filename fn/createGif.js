const Gif = import('make-a-gif');
const { createCanvas, loadImage } = require('canvas');
const { messageLink } = require('discord.js');
const imgbbUploader = require('imgbb-uploader');
const cfg = require.main.require('./cfg.json');

module.exports = async (boards, endMessage, gameId) => {
    try {
        let sizes = [];
        let files = await Promise.all(
            (await Promise.all(
                boards.map(board => `https://cdn.discordapp.com/attachments/${endMessage.channel.id}/${board.file}/file.jpg`)
                    .map(board => loadImage(board)))
            ).map(board => new Promise(async res => {
                sizes = [board.width/2, board.height/2];
                let canvas = createCanvas(sizes[0], sizes[1]);
                canvas.getContext('2d').drawImage(board, 0, 0, canvas.width, canvas.height);
                res({src: canvas.toBuffer()});
            }))
        );
        let encoder = new (await Gif).Gif(sizes[0], sizes[1], 75);
        await encoder.setFrames(files);
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