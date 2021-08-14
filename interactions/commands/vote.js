const db = require.main.require('./models');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const controlOnly = require('../../fn/controlOnly');
const getVotes = require('../../fn/getVotes');

module.exports = {
    name: 'vote',
    description: 'Sets your jury vote.',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;
        await interaction.deferReply({ephemeral: true});
        let player = await db.Player.findOne({where: {game: game.id, user: interaction.user.id}});
        if (player == null || player.alive)
            return interaction.editReply({content: 'Only dead players may use this command!'});
        let players = await db.Player.findAll({where: {game: game.id, alive: true}});
        await Promise.all(players.map(async p => {
            let user = await interaction.client.users.fetch(p.user);
            p.name = user.username;
        }));
        await interaction.editReply({
            content: `Your vote is currently: ${player.vote == null ? 'No one' : `<@${(await db.Player.findOne({where: {id: player.vote}})).user}>`}.`,
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('vote')
                            .setPlaceholder('Vote')
                            .addOptions([{
                                label: 'No one',
                                description: '',
                                value: 'null',
                            }])
                            .addOptions(await Promise.all(players.map(async p => ({
                                label: p.name,
                                description: `Votes: ${await getVotes(game, p)}`,
                                value: String(p.id),
                            })))),
                    )
            ],
        });
    }
};