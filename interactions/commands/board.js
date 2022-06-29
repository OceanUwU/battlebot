const imgbbUploader = require('imgbb-uploader');
const db = require.main.require('./models');
const renderBoard = require.main.require('./fn/renderBoard.js');
const controlOnly = require.main.require('./fn/controlOnly.js');
const cfg = require.main.require('./cfg.json');

module.exports = {
    name: 'board',
    description: 'Displays the current board to you only.',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;

        await interaction.deferReply({ephemeral: true});
        let img = await imgbbUploader({
            apiKey: cfg.imgbbkey,
            base64string: (await renderBoard(game)).toString('base64'),
            expiration: 21600, //6 hours
        });
        await interaction.editReply({content: img.url});
    }
};