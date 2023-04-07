const { ActivityType, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`${client.user.tag} is up`);
        client.user.setActivity('pages turn', { type: ActivityType.Watching });
    },
};