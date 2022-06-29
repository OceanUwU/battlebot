const db = require.main.require('./models');
const isMod = require('../../fn/isMod');
const pointRates = require('../../consts/pointRates');
const editSettingsMessage = require('../../fn/editSettingsMessage');

module.exports = async interaction => {
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to change this.', ephemeral: true});
    await db.Game.update({pointRate: Number(interaction.values[0])}, {where: {id: game.id}});
    await interaction.reply({content: `<@${interaction.user.id}> changed the AP distribution interval to ${pointRates.find(pr => pr[1] == Number(interaction.values[0]))[0]}.`});
    await editSettingsMessage(await db.Game.findOne({where: {id: game.id}}), interaction.message);
};