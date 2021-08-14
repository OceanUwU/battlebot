const { Client, Intents } = require('discord.js');
const cfg = require('./cfg.json');
const requireDir = require('require-dir');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
module.exports = bot;
var commands = requireDir('interactions/commands');
var buttons = requireDir('interactions/buttons');
var selectMenus = requireDir('interactions/selectMenus');

bot.once('ready', async () => {
	console.log('Connected, registering commands...');
    await bot.application?.fetch();
    await (cfg.dev ? bot.guilds.cache.get(cfg.devServer) : bot.application)?.commands.set(Object.values(commands));
	console.log('Ready!');
});

bot.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		if (!commands.hasOwnProperty(interaction.commandName)) return;
	
		try {
			await commands[interaction.commandName].execute(interaction);
		} catch (error) {
			console.log(error);
			try {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			} catch {}
		}
	} else if (interaction.isButton()) {
		let num = Number(interaction.customId[interaction.customId.length-1]);
		let id = Number.isNaN(num) ? interaction.customId : interaction.customId.slice(0, -1);
		if (!buttons.hasOwnProperty(id)) return;
	
		try {
			if (Number.isNaN(num))
				await buttons[id](interaction);
			else
				await buttons[id](interaction, num);
		} catch (error) {
			console.log(error);
			try {
				await interaction.reply({ content: 'There was an error while trying to deal with this button press!', ephemeral: true });
			} catch {}
		}
	} else if (interaction.isSelectMenu()) {
		if (!selectMenus.hasOwnProperty(interaction.customId)) return;
	
		try {
			await selectMenus[interaction.customId](interaction);
		} catch (error) {
			console.log(error);
			try {
				await interaction.reply({ content: 'There was an error while trying to deal with this selection!', ephemeral: true });
			} catch {}
		}
	}
});

bot.login(cfg.token);