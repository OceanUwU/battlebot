const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');

const rankNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = {
    name: 'list',
    description: 'Displays the list of players in this game.',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;

        await interaction.deferReply({ephemeral: true});
        let players = await db.Player.findAll({where: {game: game.id}});
        await interaction.editReply({content: `${players.length} players:\n\n${players.map(p => `${rankNames[p.x]}${p.y+1}: <@${p.user}> [\\♥=${p.health}|r=${p.range}]`).join('\n')}`, allowedMentions: {users: []}});
    }
};