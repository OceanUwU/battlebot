const { Message } = require('discord.js')
const db = require.main.require('./models');
const pointRates = require('../../consts/pointRates');

const isOn = bool => bool ? '✅' : '❌';

db.Game.prototype.editSettingsMessage = async function(interaction) {
    await interaction[interaction instanceof Message ? 'edit' : 'update']({content: `${(interaction instanceof Message ? interaction : interaction.message).content.split('\n')[0]}

__General:__
AP distribution interval: ${pointRates.find(pr => pr[1] == this.pointRate)[0]}
Board size: ${this.width}x${this.height}
AP is stolen on kill: ${isOn(this.stealActions)}
Diagonal movement: ${isOn(this.diagonals)}
Allow pushing: ${isOn(this.allowPushing)}
Allow gifting: ${isOn(this.allowGifting)}
Allow upgrading range: ${isOn(this.allowUpgrading)}

__Starting Player Stats:__
Hearts: ${this.startingHearts}
Range: ${this.startingRange}
AP: ${this.startingActions}

__Drops:__
Hearts: ${isOn(this.heartDrops)}
Batteries: ${isOn(this.batteryDrops)}
Range: ${isOn(this.rangeDrops)}
Portal: ${isOn(this.portalDrops)}
Black Hole: ${isOn(this.blackHoleDrops)}
    `});
};