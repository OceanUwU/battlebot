const db = require.main.require('./models');
const pointRates = require('../../consts/pointRates');

function formatTime(ms) {
    let secs = ms / 1000;
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs / 3600) % 24);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.round(secs % 60);
    return `${d > 0 ? `${d} days, ` : ''}${d > 0 || h > 0 ? `${h} hours, ` : ''}${d > 0 || h > 0 || m > 0 ? `${m} minutes and ` : ''}${d > 0 || h > 0 || m > 0 || s > 0 ? `${s} seconds` : ''}`;
}

module.exports = {
    name: 'nextap',
    description: 'Tells you when the next AP distribution will be.',
    options: [{
        name: 'send',
        description: 'Should the next AP time be visible to everyone, instead of just you?',
        type: 5, //boolean
    }],
    contextMenu: true,
    async execute(interaction) {
        let game = await db.Game.findOne({where: {channel: interaction.channelId}});
        if (!game)
            return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
        if (!game.started)
            return interaction.reply({content: 'This game hasn\'t started yet.', ephemeral: true});
        
        if (game.pointRate == 0)
            await interaction.reply({content: `AP is distributed manually, ask the mods`, ephemeral: interaction.options.getBoolean('send') !== true});
        else
            await interaction.reply({content: `AP is distributed every ${pointRates.find(pr => pr[1] == game.pointRate)[0]}.\nNext AP at <t:${~-(game.nextPoint/1000)}:F>, which is <t:${~-(game.nextPoint/1000)}:R>.`, ephemeral: interaction.options.getBoolean('send') !== true});
    }
};