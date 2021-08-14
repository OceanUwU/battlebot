const cfg = require('../cfg.json');

async function isMod(interaction) {
    return interaction.member.permissions.has('MANAGE_GUILD') || cfg.overriders.includes(interaction.user.id);
}

module.exports = isMod;