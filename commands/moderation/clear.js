const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clears messages from a channel')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('amount of messages to clear')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true),
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const channel = interaction.channel;
        await channel.bulkDelete(amount);
        return await interaction.reply(`cleared ${amount == 1 ? 'message' : 'messages' } from ${channel.name}`);
    },
};