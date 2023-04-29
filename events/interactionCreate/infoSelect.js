const { EmbedBuilder } = require('discord.js');
const Embed = require('../../schemas/embed.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.customId === 'info_select' || !interaction.isStringSelectMenu()) return;
        const info_embed = new EmbedBuilder()
            .setColor(process.env.COLOUR);
        switch (interaction.values[0]) {
        case 'info_about_us': {
            const about_us = await Embed.findOne({ name: 'about us' });
            if (!about_us) return await interaction.reply({ content: 'this embed is not working at the moment', ephemeral: true });
            about_us.thumbnail ? info_embed.setThumbnail(about_us.thumbnail) : 0;
            about_us.image ? info_embed.setImage(about_us.image) : 0;
            await interaction.reply({ embeds: [info_embed.setDescription(about_us.content)], ephemeral: true });
            break;
        }
        case 'info_strike_system': {
            const strike_system = await Embed.findOne({ name: 'strike system' });
            if (!strike_system) return await interaction.reply({ content: 'this embed is not working at the moment', ephemeral: true });
            strike_system.thumbnail ? info_embed.setThumbnail(strike_system.thumbnail) : 0;
            strike_system.image ? info_embed.setImage(strike_system.image) : 0;
            await interaction.reply({ embeds: [info_embed.setDescription(strike_system.content)], ephemeral: true });
            break;
        }
        case 'info_server_rewards': {
            const server_rewards = await Embed.findOne({ name: 'server rewards' });
            if (!server_rewards) return await interaction.reply({ content: 'this embed is not working at the moment', ephemeral: true });
            server_rewards.thumbnail ? info_embed.setThumbnail(server_rewards.thumbnail) : 0;
            server_rewards.image ? info_embed.setImage(server_rewards.image) : 0;
            await interaction.reply({ embeds: [info_embed.setDescription(server_rewards.content)], ephemeral: true });
            break;
        }
        case 'info_server_map': {
            const server_map = await Embed.findOne({ name: 'server map' });
            if (!server_map) return await interaction.reply({ content: 'this embed is not working at the moment', ephemeral: true });
            server_map.thumbnail ? info_embed.setThumbnail(server_map.thumbnail) : 0;
            server_map.image ? info_embed.setImage(server_map.image) : 0;
            await interaction.reply({ embeds: [info_embed.setDescription(server_map.content)], ephemeral: true });
            break;
        }
        case 'info_p&a': {
            const p_and_a = await Embed.findOne({ name: 'p&a' });
            if (!p_and_a) return await interaction.reply({ content: 'this embed is not working at the moment', ephemeral: true });
            p_and_a.thumbnail ? info_embed.setThumbnail(p_and_a.thumbnail) : 0;
            p_and_a.image ? info_embed.setImage(p_and_a.image) : 0;
            await interaction.reply({ embeds: [info_embed.setDescription(p_and_a.content)], ephemeral: true });
            break;
        }
        }
    },
};