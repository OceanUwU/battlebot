module.exports = {
    name: 'ping',
    description: 'test if im online lol',
    async execute(interaction) {
        await interaction.reply({content: 'Pong!', ephemeral: true});
    }
};