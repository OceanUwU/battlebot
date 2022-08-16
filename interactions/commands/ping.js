module.exports = {
    name: 'ping',
    description: 'test if im online lol',
    options: [{
        name: 'send',
        description: 'Should the response be visible to everyone, instead of just you?',
        type: 5, //boolean
    }],
    async execute(interaction) {
        await interaction.reply({content: 'Pong!', ephemeral: interaction.options.getBoolean('send') !== true});
    }
};