require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
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
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);