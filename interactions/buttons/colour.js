const db = require.main.require('./models');
const configMenu = require.main.require('./fn/configMenu.js');
const randomColour = require.main.require('./fn/randomColour.js');

module.exports = async (interaction, type) => {
    await interaction.deferUpdate();
    let config = await db.User.findOne({where: {id: interaction.user.id}});
    if (type == 0 || type == 2)
        config.colour1 = randomColour();
    if (type == 1 || type == 2)
        config.colour2 = randomColour();
    await config.save();
    await interaction.editReply(await configMenu(interaction));
};