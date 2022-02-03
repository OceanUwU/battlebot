const db = require.main.require('./models');
const controlOnly = require.main.require('./fn/controlOnly.js');
const isMod = require('../../fn/isMod');
const getVotes = require('../../fn/getVotes');
const log = require('../../fn/log');

const votesPerAction = 3;

module.exports = {
    name: 'distribute',
    description: 'Distributes 1 AP to every alive player (plus extra to those who\'ve received votes from the jury).',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;
        if (!isMod(interaction))
            return interaction.reply({content: 'You must have the Manage Server permission to use this command.', ephemeral: true});
        await interaction.deferReply({ephemeral: true});
        let players = await db.Player.findAll({where: {game: game.id, alive: true}});
        let logging = `${interaction.user.username} distributed AP.\n`;
        for (let player of players) {
            let votes = await getVotes(game, player);
            let received = 1 + Math.floor(votes/votesPerAction);
            await db.Player.update({actions: player.actions+received}, {where: {id: player.id}});
            logging += `\n<@${player.user}>: +${received} AP (${votes} votes)`;
        }
        await log(game, logging, false);
        await interaction.editReply({content: 'Successfully distributed AP.'});
    }
};