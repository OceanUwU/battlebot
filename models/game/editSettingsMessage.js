const { Message } = require('discord.js')
const db = require.main.require('./models');
const pointRates = require('../../consts/pointRates');

const isOn = bool => bool ? '✅' : '❌';

db.Game.prototype.editSettingsMessage = async function(interaction, type) {
    let text;
    
    switch (type) {
        case 0:
            text = `
AP distribution interval: ${pointRates.find(pr => pr[1] == this.pointRate)[0]}
Board size: ${this.width}x${this.height}
### Drops
Hearts: ${isOn(this.heartDrops)}
Batteries: ${isOn(this.batteryDrops)}
Range: ${isOn(this.rangeDrops)}
Portal: ${isOn(this.portalDrops)}
Black Hole: ${isOn(this.blackHoleDrops)}
            `;
            break;

        case 1:
            text = `
Starting Stats: **${this.startingHearts} ❤️    ${this.startingRange} 🏹    ${this.startingActions} 🪙**
AP is stolen on kill: ${isOn(this.stealActions)}
Diagonal movement: ${isOn(this.diagonals)}
Allow pushing: ${isOn(this.allowPushing)}
Allow gifting: ${isOn(this.allowGifting)}
Allow upgrading range: ${isOn(this.allowUpgrading)}
            `;
            break;
    }

    console.log(text);
    await interaction[interaction instanceof Message ? 'edit' : 'update']({content: `${(interaction instanceof Message ? interaction : interaction.message).content.split('\n')[0]}\n${text}`});
};