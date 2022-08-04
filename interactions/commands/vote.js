const db = require.main.require('./models');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const controlOnly = require('../../fn/controlOnly');

module.exports = {
    name: 'vote',
    description: 'Sets your jury vote.',
    async execute(interaction) {
        let game = await controlOnly(interaction);
        if (game == null) return;
        await interaction.deferReply({ephemeral: true});
        let player = await db.Player.findOne({where: {gameId: game.id, user: interaction.user.id}});
        if (player == null)
            return interaction.editReply({content: 'Only players may use this command!'});
        let players = await game.getPlayers({alive: true});
        await game.getChannel();
        await Promise.all(players.map(async p => {
            p.game = game;
            await p.getName();
        }));
        await interaction.editReply({
            content: `${player.alive ? 'Setting your vote while alive will have no effect until you\'re dead.\n' : ''}Your vote is currently: ${player.vote == null ? 'No one' : `<@${(await db.Player.findOne({where: {id: player.vote}})).user}>`}.`,
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
                                description: `Votes: ${await p.getVotes()}`,
                                value: String(p.id),
                            })))),
                    )
            ],
        });
    }
};