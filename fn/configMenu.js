const db = require.main.require('./models');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');

const styleSelector = new ActionRowBuilder()
    .addComponents(
        new SelectMenuBuilder()
            .setCustomId('style')
            .setPlaceholder('Overlay')
            .addOptions(['None', 'Diagonal', 'Radial', 'Waves', 'Stripes', "Circles", "Hexagonal", "Peaks", "Spiral"].map(i => ({
                label: i,
                value: i.toLowerCase(),
            }))),
        );
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
const inverter = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('invert')
            .setLabel('Invert')
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

    return {
        content: '',
        files: [(await pseudoPlayer.render()).toBuffer('image/png')],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('image')
                        .setPlaceholder('Background')
                        .addOptions([{name: 'none'}, {name: 'avatar'}, ...await db.Image.findAll({where: {user: interaction.user.id}})].map(i => ({
                            label: i.name.slice(0,1).toUpperCase() + i.name.slice(1),
                            value: i.name,
                        }))),
                ),
            styleSelector,
            colourRandomisers,
            inverter
        ],
    };
}