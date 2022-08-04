const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');

const playerInfo = p => `${db.Game.tileName(p.x, p.y)}: <@${p.user}> [\\♥=${p.health}|r=${p.range}]`;

module.exports = {
    name: 'list',
    description: 'Displays the list of players in this game.',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;

        await interaction.deferReply({ephemeral: true});
        let alive = await game.getPlayers({alive: true});
        let dead = await game.getPlayers({alive: false});
        await interaction.editReply({content: `__${alive.length + dead.length} players__:\n\n__${alive.length} alive__:\n${alive.map(playerInfo).join('\n')}\n\n__${dead.length} dead__:\n${dead.map(playerInfo).join('\n')}`, allowedMentions: {users: []}});
    }
};