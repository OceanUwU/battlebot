const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const db = require('../');

db.Player.prototype.playersInRangeSelectMenu = async function() {
    let options = (await this.playersInRange()).map(player => ({
        label: player.name,
        description: db.Game.tileName(player.x, player.y),
        value: String(player.id),
    }));

    if (options.length > 0) 
        return new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('player')
                    .setPlaceholder('Player')
                    .addOptions(options),
            );
    else
        return null;
}