const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');

module.exports = async interaction => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;

    /*let components = interaction.message.components;
    components.forEach(row => {
        row.components.forEach(component => {
            if (component.type == 'BUTTON')
                component.setDisabled(false);
        });
    });*/
    await db.Player.update({playerSelection: Number(interaction.values[0])}, {where: {id: player.id}});
    await interaction.deferUpdate();
    //await interaction.reply({content: 'Successfully selected player.', ephemeral: true});
    //await interaction.update({components});
};