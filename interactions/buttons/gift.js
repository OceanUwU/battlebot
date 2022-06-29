const db = require.main.require('./models');
const aliveOnly = require.main.require('./fn/aliveOnly.js');
const controlCentre = require.main.require('./fn/controlCentre.js');
const playersInRange = require.main.require('./fn/playersInRange.js');
const endGame = require.main.require('./fn/endGame.js');
const log = require.main.require('./fn/log.js');

const cost = 1;

module.exports = async (interaction, type) => {
    let [game, player] = await aliveOnly(interaction);
    if (game == null) return;
    let players = await playersInRange(game, player);
    let gifting = players.find(p => p.id == player.playerSelection);
    if (gifting == null)
        return interaction.reply({content: 'That player is not in range.', ephemeral: true});
    if (type == 0) { //action
        if (player.actions < cost)
            return interaction.reply({content: 'You don\'t have any AP to gift!', ephemeral: true});
        if (!gifting.alive)
            return interaction.reply({content: 'Dead players can\'t have AP.', ephemeral: true});
        
        await db.Player.update({actions: player.actions-1}, {where: {id: player.id}});
        await db.Player.update({actions: gifting.actions+1}, {where: {id: gifting.id}});
        await (await interaction.client.users.fetch(gifting.user)).send(`<@${interaction.user.id}> GIFTed you 1 AP!`);
    } else if (type == 1) { //health        
        await db.Player.update({health: player.health-1, alive: player.health > 1, deathTime: player.health == 1 ? Date.now() : null}, {where: {id: player.id}});
        await db.Player.update({health: gifting.health+1, alive: true, deathTime: null}, {where: {id: gifting.id}});
        if (!gifting.alive) { //if reviving
            let giftingMember = await interaction.guild.members.fetch(gifting.user);
            await giftingMember.roles.remove(game.juryRole);
            await giftingMember.roles.add(game.playerRole);
        }
        log(game, `${interaction.user.username} GIFTed <@${gifting.user}> a heart.${gifting.alive ? '' : `\n<@${gifting.user}> was revived! They can no longer **/vote** as a jury member, but they can use **/c** again!`}`);
        if ((await db.Player.count({where: {game: game.id, alive: true}})) <= 1)
            await endGame(game);
    }
    await interaction.update({content: (await controlCentre(game, await db.Player.findOne({where: {id: player.id}}))).content});
};