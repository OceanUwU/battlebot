const cfg = require('../cfg.json');
module.exports = interaction => interaction.member.permissions.has('MANAGE_GUILD') || cfg.overriders.includes(interaction.user.id);