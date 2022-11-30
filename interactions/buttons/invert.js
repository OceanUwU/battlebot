const db = require.main.require('./models');
const configMenu = require.main.require('./fn/configMenu.js');

module.exports = async (interaction) => {
    await interaction.deferUpdate();
    let config = await db.User.findOne({where: {id: interaction.user.id}});
    config.inverted = !config.inverted;
    await config.save();
    await interaction.editReply(await configMenu(interaction));
};