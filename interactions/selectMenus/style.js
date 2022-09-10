const db = require.main.require('./models');
const configMenu = require.main.require('./fn/configMenu.js');

module.exports = async interaction => {
    await interaction.deferUpdate();
    await db.User.update({style: interaction.values[0]}, {where: {id: interaction.user.id}});
    await interaction.editReply(await configMenu(interaction));
};