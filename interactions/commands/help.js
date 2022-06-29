module.exports = {
    name: 'help',
    description: 'What\'s going on?!',
    async execute(interaction) {
        await interaction.reply({content: 'https://battlebot.ocean.lol', ephemeral: true});
    }
};