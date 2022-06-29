const { MessageActionRow, MessageButton } = require('discord.js');
const imgbbUploader = require('imgbb-uploader');
const renderBoard = require.main.require('./fn/renderBoard.js');
const cfg = require.main.require('./cfg.json');

async function controlCentre(game, player) {
    let img = await imgbbUploader({
        apiKey: cfg.imgbbkey,
        base64string: (await renderBoard(game, player)).toString('base64'),
        expiration: 21600, //6 hours
    });

    return {
        content: `YOU HAVE ${player.actions} ACTION POINTS.\n${img.url}`,
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('movemenu')
                        .setLabel('MOVE (1)')
                        .setStyle('PRIMARY'),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('shootmenu')
                        .setLabel('SHOOT (1)')
                        .setStyle('DANGER'),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('giftmenu')
                        .setLabel('GIFT (0)')
                        .setStyle('PRIMARY'),
                ),
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('heal')
                        .setLabel('HEAL (3)')
                        .setStyle('SUCCESS'),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('upgrade')
                        .setLabel('UPGRADE (3)')
                        .setStyle('SUCCESS'),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('pushmenu')
                        .setLabel('PUSH (1)')
                        .setStyle('SECONDARY'),
                )
        ],
    };
}

module.exports = controlCentre;