const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        const cooldowns = interaction.client.cooldowns;
        if (!cooldowns.has(command.data.name) && !command.cooldowns) cooldowns.set(command.data.name, new Collection());
        const [now, timestamps, cooldownAmonunt] = [Date.now(), cooldowns.get(command.data.name), command.cooldown * 1000];
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmonunt;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return await interaction.reply({
                    content: `you can use the \`${command.data.name}\` command <t:${expiredTimestamp}:R>`,
                    ephemeral: true,
                });
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmonunt);
        // PUT THE COOLDOWNS IN A DATABASE!!!!
        try { await command.execute(interaction); }
        catch (error) {
            const trylater = [
                'this command is faulty',
                'this cmd is unavailable',
                'smth unexpected happened',
                'something weeeird happened',
                'this command isn\'t working rn',
            ];
            const replies = [
                'there was an error while executing this command :(',
                'this command didn\'t work :(',
                'something went wrong :(',
                'an error occured :(',
                'there\'s something wrong with this command :(',
                `${trylater[Math.floor(Math.random() * trylater.length)]}, try again later lolsies :')`,
            ];
            console.error(error);
            await interaction.reply({
                content: replies[Math.floor(Math.random() * replies.length)],
                ephemeral: true,
            });
        }
    },
};