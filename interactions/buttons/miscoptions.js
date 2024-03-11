const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

const options = ['stealActions', 'diagonals', 'allowPushing', 'allowGifting', 'allowUpgrading'];

module.exports = async (interaction, type) => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    let option = options[type];
    await game.update({[option]: !game[option]});
    await game.editSettingsMessage(interaction, 1);
};