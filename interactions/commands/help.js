module.exports = {
    name: 'help',
    description: 'What\'s going on?!',
    options: [{
        name: 'send',
        description: 'Should this help message be visible to everyone, instead of just you?',
        type: 5, //boolean
    }],
    async execute(interaction) {
        await interaction.reply({content: 'https://battlebot.ocean.lol', ephemeral: interaction.options.getBoolean('send') !== true});
    }
};