const db = require('../');
const { MessageActionRow, MessageButton } = require('discord.js');
const imgbbUploader = require('imgbb-uploader');
const cfg = require.main.require('./cfg.json');

db.Player.prototype.controlCentre = async function() {
    await this.getGame();

    let img = await imgbbUploader({
        apiKey: cfg.imgbbkey,
        base64string: (await this.game.renderBoard(this)).toString('base64'),
        expiration: 21600, //6 hours
    });

    return {
        content: `YOU HAVE ${this.actions} ACTION POINTS.\n${img.url}`,
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