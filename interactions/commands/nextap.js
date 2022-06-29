const db = require.main.require('./models');
const pointRates = require('../../consts/pointRates');

function formatTime(ms) {
    let secs = ms / 1000;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.round(secs % 60);
    return [
      h,
      m > 9 ? m : (h ? '0' + m : m || '0'),
      s > 9 ? s : '0' + s
    ].filter(Boolean).join(':');
}

module.exports = {
    name: 'nextap',
    description: 'Tells you when the next AP distribution will be.',
    async execute(interaction) {
        let game = await db.Game.findOne({where: {channel: interaction.channelId}});
        if (!game)
            return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
        if (!game.started)
            return interaction.reply({content: 'This game hasn\'t started yet.', ephemeral: true});
        
        if (game.pointRate == 0)
            await interaction.reply({content: `AP is distributed manually, ask the mods`, ephemeral: true});
        else
            await interaction.reply({content: `Interval: ${pointRates.find(pr => pr[1] == game.pointRate)[0]}\nNext AP: ${game.nextPoint - Date.now() < 0 ? 'less than a minute!' : formatTime(game.nextPoint - Date.now())}`});
    }
};