const { Client, Intents } = require('discord.js');
const cfg = require('./cfg.json');
const requireDir = require('require-dir');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
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
			commands[interaction.commandName].execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} else if (interaction.isButton()) {
		if (!buttons.hasOwnProperty(interaction.customId)) return;
	
		try {
			buttons[interaction.customId](interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while trying to deal with this button press!', ephemeral: true });
		}
	} else if (interaction.isSelectMenu()) {
		if (!selectMenus.hasOwnProperty(interaction.customId)) return;
	
		try {
			selectMenus[interaction.customId](interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while trying to deal with this selection!', ephemeral: true });
		}
	}
});

bot.login(cfg.token);