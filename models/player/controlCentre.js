const db = require('../');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('movemenu')
                        .setLabel('MOVE (1)')
                        .setStyle(ButtonStyle.Primary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('shootmenu')
                        .setLabel('SHOOT (1)')
                        .setStyle(ButtonStyle.Danger),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('giftmenu')
                        .setLabel('GIFT (0)')
                        .setStyle(ButtonStyle.Primary),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('heal')
                        .setLabel('HEAL (3)')
                        .setStyle(ButtonStyle.Success),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('upgrade')
                        .setLabel('UPGRADE (3)')
                        .setStyle(ButtonStyle.Success),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('pushmenu')
                        .setLabel('PUSH (1)')
                        .setStyle(ButtonStyle.Secondary),
                )
        ],
    };
}