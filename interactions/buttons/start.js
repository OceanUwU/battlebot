const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require.main.require('./models');
const isMod = require('../../fn/isMod');

module.exports = async interaction => {
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to start the game.', ephemeral: true});
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (game.started)
        return interaction.reply({content: 'This game has already started.', ephemeral: true});
    let players = await game.getPlayers();
    if (players.length < 2)
        return interaction.reply({content: 'You need at least 2 players to play!', ephemeral: true});

    await interaction.deferReply({ephemeral: true}); //show loading message

    let locations = [];
    await Promise.all(players.map(async player => new Promise(async res => {
        let loc;
        do {
            loc = [Math.floor(Math.random() * game.width), Math.floor(Math.random() * game.height)];
        } while (locations.some(l => l[0] == loc[0] && l[1] == loc[1]))
        locations.push(loc);

        await player.update({x: loc[0], y: loc[1], health: game.startingHearts, range: game.startingRange, actions: game.startingActions});
        res();
    })));

    await game.update({started: true, nextPoint: Date.now()});
    let startMessage = await game.log('The game has begun!');
    await interaction.channel.send({content: `${players.map(p => `<@${p.user}>`).join(' ')}\nType **/c** to control your player here.`, components: [
        new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Rules').setStyle(ButtonStyle.Link).setURL('https://battlebot.ocean.lol/'))
    ]});
    await startMessage.pin().catch(e => {});
    await interaction.editReply({content: 'Game started!'});
};