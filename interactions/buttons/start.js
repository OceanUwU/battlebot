const db = require.main.require('./models');
const alphabet = 'abcdefghijklmnopqrstuvwxyz012346789';
//size: 20x12
module.exports = async interaction => {
    let game = await db.Game.findOne({where: {setupChannel: interaction.channelId}});
    let players = await db.Player.findAll({where: {game: game.id}});
    if (players.length < 1)
        return interaction.reply({content: 'You need at least 3 players to play!', ephemeral: true});
    let locations = [];
    players.forEach(async player => {
        let loc;
        do {
            loc = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 12)];
        } while (locations.some(l => l[0] == loc[0] && l[1] == loc[1]))
        locations.push(loc);
        
        await db.Player.update({
            x: loc[0],
            y: loc[1],
        }, {where: {id: player.id}});
    });

    let name = 'dd-';
    for (let i = 0; i < 5; i++)
        name += alphabet[Math.floor(Math.random() * alphabet.length)];
    let playerRole = await interaction.guild.roles.create({name: name+'-player'});
    players.forEach(async player => (await interaction.guild.members.fetch(player.user))?.roles.add(playerRole));
    let juryRole = await interaction.guild.roles.create({name: name+'-jury'});
    let category = await interaction.guild.channels.create(name, {
        type: 'GUILD_CATEGORY',
        permissionOverwrites: [
            {
                id: interaction.guild.roles.cache.find(r => r.rawPosition == 0).id, //@everyone role
                deny: ['SEND_MESSAGES', 'CONNECT']
            },
            {
                id: interaction.client.user.id,
                allow: ['SEND_MESSAGES', 'CONNECT']
            },
            {
                id: playerRole.id,
                allow: ['SEND_MESSAGES', 'CONNECT']
            },
            {
                id: juryRole.id,
                allow: ['SEND_MESSAGES', 'CONNECT']
            },
        ]
    });
    let control = await interaction.guild.channels.create(name+'-control', {type: 'GUILD_TEXT'});
    await control.setParent(category);
    let log = await interaction.guild.channels.create(name+'-log', {type: 'GUILD_TEXT'});
    await log.setParent(category);
    await log.edit({
        permissionOverwrites: [
            {
                id: interaction.guild.roles.cache.find(r => r.rawPosition == 0).id, //@everyone role
                deny: ['SEND_MESSAGES']
            },
            {
                id: interaction.client.user.id,
                allow: ['SEND_MESSAGES']
            },
            {
                id: playerRole.id,
                deny: ['SEND_MESSAGES']
            },
            {
                id: juryRole.id,
                deny: ['SEND_MESSAGES']
            },
        ]
    });
    let voice = await interaction.guild.channels.create(name+'-voice', {type: 'GUILD_VOICE', userLimit: players.length});
    await voice.setParent(category);

    await db.Game.update({
        started: true,
        nextPoint: Date.now(),
        setupChannel: null,
        commandChannel: control.id,
        logChannel: log.id,
        playerRole: playerRole.id,
        juryRole: juryRole.id,
    }, {where: {id: game.id}});

    await interaction.reply(`<@${interaction.user.id}> started the game. Go to <#${control.id}> to play. This thread will now be archived.`);
    await interaction.message.channel.setArchived(true, 'game started');
};