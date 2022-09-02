const { Message } = require('discord.js')
const db = require.main.require('./models');
const pointRates = require('../../consts/pointRates');

db.Game.prototype.editSettingsMessage = async function(interaction) {
    await interaction[interaction instanceof Message ? 'edit' : 'update']({content: `${(interaction instanceof Message ? interaction : interaction.message).content.split('\n')[0]}\n\n__General:__\nBoard size: ${this.width}x${this.height}\nAP distribution interval: ${pointRates.find(pr => pr[1] == this.pointRate)[0]}\n\n__Drops:__\nHearts: ${this.heartDrops ? '✅' : '❌'}\nBatteries: ${this.batteryDrops ? '✅' : '❌'}\nRange: ${this.rangeDrops ? '✅' : '❌'}\nPortal: ${this.portalDrops ? '✅' : '❌'}\nBlack Hole: ${this.blackHoleDrops ? '✅' : '❌'}\n\n__Starting Stats:__:\nHearts: ${this.startingHearts}\nRange: ${this.startingRange}`});
};