require('dotenv/config');
const [fs, path] = [require('node:fs'), require('node:path')];
const { Client, Collection, Events, IntentsBitField, Partials } = require('discord.js');
const client = new Client({
	intents: [
		IntentsBitField.Flags.AutoModerationConfiguration,
		IntentsBitField.Flags.AutoModerationExecution,
		IntentsBitField.Flags.DirectMessageReactions,
		IntentsBitField.Flags.DirectMessageTyping,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.GuildEmojisAndStickers,
		IntentsBitField.Flags.GuildIntegrations,
		IntentsBitField.Flags.GuildInvites,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildMessageTyping,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildModeration,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.GuildWebhooks,
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.MessageContent,
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.GuildScheduledEvent,
		Partials.Message,
		Partials.Reaction,
		Partials.ThreadMember,
		Partials.User,
	],
});

client.commands = new Collection();
client.events = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventSubFolders = fs.readdirSync(eventsPath);
for (let i = 0; i < eventSubFolders.length; i++) {
	const eventFolder = eventSubFolders[i];
	const eventFiles = fs.readdirSync(`${eventsPath}/${eventFolder}`).filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const filePath = path.join(`${eventsPath}/${eventFolder}`, file);
		const event = require(filePath);
		if (event.once) { client.once(event.name, (...args) => event.execute(...args)); }
		else { client.on(event.name, (...args) => event.execute(...args)); }
	}
}

client.once(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}!`);
});

client.login(process.env.TOKEN);