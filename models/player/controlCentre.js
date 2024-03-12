const db = require('../');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cfg = require.main.require('./cfg.json');

const components = {
    move: new ButtonBuilder()
        .setCustomId('movemenu')
        .setLabel('MOVE (1)')
        .setStyle(ButtonStyle.Primary),
    shoot: new ButtonBuilder()
        .setCustomId('shootmenu')
        .setLabel('SHOOT (1)')
        .setStyle(ButtonStyle.Danger),
    gift: new ButtonBuilder()
        .setCustomId('giftmenu')
        .setLabel('GIFT (0)')
        .setStyle(ButtonStyle.Primary),
    heal: new ButtonBuilder()
        .setCustomId('heal')
        .setLabel('HEAL (3)')
        .setStyle(ButtonStyle.Success),
    vote: new ButtonBuilder()
        .setCustomId('vote')
        .setLabel('VOTE (0)')
        .setStyle(ButtonStyle.Secondary),
    upgrade: new ButtonBuilder()
        .setCustomId('upgrade')
        .setLabel('UPGRADE (3)')
        .setStyle(ButtonStyle.Success),
    push: new ButtonBuilder()
        .setCustomId('pushmenu')
        .setLabel('PUSH (1)')
        .setStyle(ButtonStyle.Secondary),
    pushSpikes: new ButtonBuilder()
        .setCustomId('pushspikemenu')
        .setLabel('PUSH SPIKE (1)')
        .setStyle(ButtonStyle.Secondary),
    refresh: new ButtonBuilder()
        .setCustomId('refresh')
        .setLabel('⟳')
        .setStyle(ButtonStyle.Secondary),
}

db.Player.prototype.controlCentre = async function() {
    await this.getGame();

    let row1 = [components.move, components.shoot];
    if (this.game.allowGifting)
        row1.push(components.gift)
    if (this.game.votesneeded != 0)
        row1.push(components.vote)
    
    let row2 = [components.heal];
    if (this.game.allowUpgrading)
        row2.push(components.upgrade)
    if (this.game.allowPushing) {
        row2.push(components.push)
        if (this.game.spikeDrops)
            row2.push(components.pushSpikes)
    }
    row2.push(components.refresh)

    return {
        content: `# ${this.actions} 🪙    ${this.health} ❤️    ${this.range} 🏹              ${db.Game.tileName(this.x, this.y)}`,
        files: [await this.game.render(this)],
        components: [new ActionRowBuilder().addComponents(row1), new ActionRowBuilder().addComponents(row2)],
    };
}