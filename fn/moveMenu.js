const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require.main.require('./models');

const translations = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
];
const directionChars = '↖↑↗→↘↓↙←';
const createButtons = (game, player, type) => Promise.all(Array(8).fill(null).map(async (e,i) => new ButtonBuilder()
    .setCustomId(`${type}${i}`)
    .setLabel(directionChars[i])
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(type == 'push' ? false : !(await available(i, game, player)))));

async function available(dir, game, player) {
    let translation = translations[dir];
    return await game.tileAvailable(player.x+translation[0], player.y+translation[1]);
}

module.exports = async (interaction, game, player, type) => {
    let buttons = await createButtons(game, player, type)
    return {
        content: (await player.controlCentre()).content,
        components: [
            new ActionRowBuilder()
            .addComponents(buttons[0])
            .addComponents(buttons[1])
            .addComponents(buttons[2]),
            
            new ActionRowBuilder()
            .addComponents(buttons[7])
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('maincontrolmenu')
                    .setLabel('x')
                    .setStyle(ButtonStyle.Danger),
            )
            .addComponents(buttons[3]),
            
            new ActionRowBuilder()
            .addComponents(buttons[6])
            .addComponents(buttons[5])
            .addComponents(buttons[4]),
        ]
    };
};