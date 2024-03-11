const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = async (interaction, type) => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    if (game.started)
        return interaction.reply({content: 'You can\'t change this after the game has started.', ephemeral: true});
    let dir = type > 1 ? 'height' : 'width';
    let val = game[dir] + ((type+1) % 2 * 2 - 1);
    if (val < 5)
        return interaction.reply({content: `Board ${dir} cannot go below 5.`, ephemeral: true});
    else if (val > 26)
        return interaction.reply({content: `Board ${dir} cannot go above 26.`, ephemeral: true});
    await game.update({[dir]: val});
    await game.editSettingsMessage(interaction, 0);
};