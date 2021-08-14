const { MessageActionRow, MessageButton } = require('discord.js');
const controlCentre = require('./controlCentre');
const tileAvailable = require('./tileAvailable');
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
const createButtons = (game, player) => Promise.all(Array(8).fill(null).map(async (e,i) => new MessageButton()
    .setCustomId(`move${i}`)
    .setLabel(directionChars[i])
    .setStyle('SECONDARY')
    .setDisabled(!(await available(i, game, player)))));

async function available(dir, game, player) {
    let translation = translations[dir];
    return await tileAvailable(game, player.x+translation[0], player.y+translation[1]);
}

module.exports = async (interaction, game, player) => {
    let buttons = await createButtons(game, player)
    return {
        content: (await controlCentre(game, player)).content,
        components: [
            new MessageActionRow()
            .addComponents(buttons[0])
            .addComponents(buttons[1])
            .addComponents(buttons[2]),
            
            new MessageActionRow()
            .addComponents(buttons[7])
            .addComponents(
                new MessageButton()
                    .setCustomId('maincontrolmenu')
                    .setLabel('x')
                    .setStyle('DANGER'),
            )
            .addComponents(buttons[3]),
            
            new MessageActionRow()
            .addComponents(buttons[6])
            .addComponents(buttons[5])
            .addComponents(buttons[4]),
        ]
    };
};