const { Client, GatewayIntentBits, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const cfg = require('./cfg.json');
const requireDir = require('require-dir');

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
module.exports = bot;
var commands = requireDir('interactions/commands');
var buttons = requireDir('interactions/buttons');
var selectMenus = requireDir('interactions/selectMenus');
var autoDistribution = require('./fn/autoDistribution');

bot.log = str => {
	console.log(`BOT: ${str}`)
};

bot.once('ready', async () => {
	bot.log('Connected, registering commands...');
	let commandsToRegister = Object.values(commands);
	for (let command of commandsToRegister.filter(c => c.contextMenu))
		for (let type of [ApplicationCommandType.User, ApplicationCommandType.Message])
			commandsToRegister.push(new ContextMenuCommandBuilder().setName(command.name).setType(type));
	await bot.application?.fetch();
	if (cfg.dev) await bot.application?.commands.set([]);
    await (cfg.dev ? bot.guilds.cache.get(cfg.devServer) : bot.application)?.commands.set(commandsToRegister);
	bot.log('Ready!');

	setInterval(autoDistribution, 60000);
	autoDistribution();
});

bot.on('interactionCreate', async interaction => {
	if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
		if (!commands.hasOwnProperty(interaction.commandName)) return;
	
		try {
			bot.log(`${interaction.user.username} ran /${interaction.commandName}`);
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
			bot.log(`${interaction.user.username} pressed ${interaction.customId}`);
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
			bot.log(`${interaction.user.username} changed  the ${interaction.customId} selectmenu`);
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