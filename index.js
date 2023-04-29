require('dotenv/config');
const [fs, path] = [require('node:fs'), require('node:path')];
const { Client, Collection, IntentsBitField, Partials } = require('discord.js');
const mongoose = require('mongoose');
const { EventEmitter } = require('node:events');
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

EventEmitter.setMaxListeners(0);
process.noDeprecation = true;

client.commands = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();

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

mongoose.set('strictQuery', true);
(async () => {
    await mongoose.connect(process.env.MONGO_URI).catch(async (err) => {
        return await mongoose.disconnect().then(console.log(`disconnected from mongodb\n${err}`));
    });
})();

client.login(process.env.TOKEN);