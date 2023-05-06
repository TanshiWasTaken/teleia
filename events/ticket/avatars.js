const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.customId?.startsWith('tickets_userInfo_avatar')) return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        const member = await interaction.guild.members.cache.find(m => m.id == ticket.author);
        switch (interaction.customId.charAt(interaction.customId.length - 1)) {
        case 'U': {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                        .setDescription(`⸝⸝ ★ __***\`${member.user.username.toLowerCase().endsWith('s') ? `${member.user.username.toUpperCase()}'` : `${member.user.username.toUpperCase()}'S`} INFO\`***__ ***!*** . . .\n
✰ \`O1\` — **__user avatar__ *!***`),
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_userInfo')
                                .setLabel('back to user info')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('◀️'),
                            new ButtonBuilder()
                                .setLabel('Link')
                                .setStyle(ButtonStyle.Link)
                                .setURL(member.user.displayAvatarURL({ dynamic: true, size: 4096 })),
                        ),
                ],
                ephemeral: true,
            });
            await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_userInfo', time: 60000 })
                .then(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                })
                .catch(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                });
            break;
        }
        case 'G': {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }))
                        .setDescription(`⸝⸝ ★ __***\`${member.user.username.toLowerCase().endsWith('s') ? `${member.user.username.toUpperCase()}'` : `${member.user.username.toUpperCase()}'S`} INFO\`***__ ***!*** . . .\n
✰ \`O1\` — **__server avatar__ *!***`),
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_userInfo')
                                .setLabel('back')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('◀️'),
                            new ButtonBuilder()
                                .setLabel('Link')
                                .setStyle(ButtonStyle.Link)
                                .setURL(member.user.displayAvatarURL({ dynamic: true, size: 4096 })),
                        ),
                ],
                ephemeral: true,
            });
            await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_userInfo', time: 60000 })
                .then(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                })
                .catch(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                });
            break;
        }
        }
    },
};