const { MessageActionRow, MessageButton } = require('discord.js');
const db = require.main.require('./models');
const alphabet = 'abcdefghijklmnopqrstuvwxyz012346789';
const log = require.main.require('./fn/log.js');
const cfg = require('../../cfg.json');
const isMod = require('../../fn/isMod');
//size: 20x12
module.exports = async interaction => {
    if (!isMod(interaction))
        return interaction.reply({content: 'You must have the Manage Server permission to start the game.', ephemeral: true});
    let game = await db.Game.findOne({where: {channel: interaction.channelId}});
    if (!game)
        return interaction.reply({content: 'Couldn\'t find this game.', ephemeral: true});
    if (game.started)
        return interaction.reply({content: 'This game has already started.', ephemeral: true});
    let players = await db.Player.findAll({where: {game: game.id}});
    if (players.length < 2 && !cfg.dev)
        return interaction.reply({content: 'You need at least 2 players to play!', ephemeral: true});

    await interaction.deferReply({ephemeral: true}); //show loading message

    let locations = [];
    await Promise.all(players.map(async player => new Promise(async res => {
        let loc;
        do {
            loc = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 12)];
        } while (locations.some(l => l[0] == loc[0] && l[1] == loc[1]))
        locations.push(loc);

        await db.Player.update({
            x: loc[0],
            y: loc[1],
        }, {where: {id: player.id}});
        res();
    })));

    let name = 'dd-';
    for (let i = 0; i < 5; i++)
        name += alphabet[Math.floor(Math.random() * alphabet.length)];
    let playerRole = await interaction.guild.roles.create({name: name+'-player'});
    await Promise.all(players.map(async player => new Promise(async res => res(await interaction.guild.members.fetch(player.user))?.roles.add(playerRole))));
    let juryRole = await interaction.guild.roles.create({name: name+'-jury'});


    await db.Game.update({
        started: true,
        nextPoint: Date.now(),
        playerRole: playerRole.id,
        juryRole: juryRole.id,
    }, {where: {id: game.id}});

    await log(await db.Game.findOne({where: {id: game.id}}), 'The game has begun!');
    await interaction.channel.send({content: `<@&${playerRole.id}> Type **/c** to control your player here.`, components: [
        new MessageActionRow().addComponents(new MessageButton().setLabel('Rules').setStyle('LINK').setURL('https://devious-disposition.ocean.lol/'))
    ]});
    await interaction.editReply({content: 'Game started!'});
};