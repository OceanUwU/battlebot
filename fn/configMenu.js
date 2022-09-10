const db = require.main.require('./models');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');

const colourRandomisers = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('colour0')
                .setLabel('Randomise colour 1')
                .setStyle(ButtonStyle.Secondary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('colour1')
                .setLabel('Randomise colour 2')
                .setStyle(ButtonStyle.Secondary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('colour2')
                .setLabel('Randomise both colours')
                .setStyle(ButtonStyle.Secondary),
        );

module.exports = async interaction => {
    let pseudoPlayer = await db.Player.build({
        user: interaction.user.id,
        alive: true,
        hearts: 0,
        range: 99,
    });
    pseudoPlayer.name = interaction.user.username;
    await pseudoPlayer.getConfig();

    let imagesAvailable = await db.Image.findAll({where: {user: interaction.user.id}});

    let styleOptions = ['Diagonal', 'Circle', 'Waves', 'Stripes'];
    if (imagesAvailable.length > 0) {
        imagesAvailable = [{name: 'white'}, ...imagesAvailable];
        styleOptions.push('Image');
    }
    let styleSelect = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('style')
                .setPlaceholder('Style')
                .addOptions(styleOptions.map(i => ({
                    label: i,
                    value: i.toLowerCase(),
                }))),
        );

    return {
        content: '',
        files: [(await pseudoPlayer.render()).toBuffer('image/png')],
        components: [styleSelect, pseudoPlayer.config.style == 'image' ? new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('image')
                    .setPlaceholder('Image')
                    .addOptions(imagesAvailable.map(i => ({
                        label: i.name.slice(0,1).toUpperCase() + i.name.slice(1),
                        value: i.name,
                    }))),
            )
        : colourRandomisers],
    };
}