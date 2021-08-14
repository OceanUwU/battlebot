const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const playersInRange = require('./playersInRange');
const rankNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = async (game, player) => {
    let options = (await playersInRange(game, player)).map(player => ({
        label: player.name,
        description: `${rankNames[player.x]}${player.y+1}`,
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