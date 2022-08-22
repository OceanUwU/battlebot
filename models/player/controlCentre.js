const db = require('../');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cfg = require.main.require('./cfg.json');

const components = [
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
        .addComponents(
            new ButtonBuilder()
                .setCustomId('refresh')
                .setLabel('⟳')
                .setStyle(ButtonStyle.Secondary),
        ),
];

db.Player.prototype.controlCentre = async function() {
    await this.getGame();

    return {
        content: `YOU HAVE ${this.actions} ACTION POINTS.`,
        files: [await this.game.renderBoard(this)],
        components,
    };
}