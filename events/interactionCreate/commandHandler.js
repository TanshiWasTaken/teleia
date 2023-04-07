const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        try {await command.execute(interaction); }
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