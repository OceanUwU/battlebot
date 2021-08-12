module.exports = async interaction => {
    await interaction.component.setPlaceholder(interaction.values[0] == '86400' ? 'Long game' : 'Short game');
    await interaction.reply({content: 'Successfully set game length.', ephemeral: true});
};