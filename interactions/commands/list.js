const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');

const playerInfo = (p, noSend) => `${db.Game.tileName(p.x, p.y)}: <@${p.user}>${noSend ? '' : ` (${p.name})`} [\\♥=${p.health}|r=${p.range}]`;

module.exports = {
    name: 'list',
    description: 'Displays the list of players in this game.',
    options: [{
        name: 'send',
        description: 'Should the list message be visible to everyone, instead of just you?',
        type: 5, //boolean
    }],
    contextMenu: true,
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;

        let noSend = interaction.options.getBoolean('send') !== true;
        await interaction.deferReply({ephemeral: noSend});
        let alive = await game.getPlayers({alive: true});
        let dead = await game.getPlayers({alive: false});
        await interaction.editReply({content: `__${alive.length + dead.length} players__:\n\n__${alive.length} alive__:\n${alive.map(p => playerInfo(p, noSend)).join('\n')}\n\n__${dead.length} dead__:\n${dead.map(p => playerInfo(p, noSend)).join('\n')}`, allowedMentions: {users: []}});
    }
};