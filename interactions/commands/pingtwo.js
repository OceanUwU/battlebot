module.exports = {
    name: 'pingtwo',
    description: 'second ping',
    async execute(interaction) {
        await interaction.reply('Pong!');
    }
};