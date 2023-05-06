const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_pin') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        if (!ticket.pinned) {
            ticket.pinned = true;
            await ticket.save();
            await interaction.channel.setPosition(0);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('this ticket is now pinned. staff members are not able to close this ticket until it gets unpinned'),
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_staffPanel')
                                .setLabel('staff panel')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('🛠️'),
                        ),
                ],
                ephemeral: true,
            });
            await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_staffPanel', time: 30000 })
                .then(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                })
                .catch(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                });
        }
        else if (ticket.pinned) {
            ticket.pinned = false;
            await ticket.save();
            await interaction.channel.setPosition(interaction.channel.parent.children.cache.size - 1);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('this ticket is no longer pinned. staff members are now able to close this ticket'),
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_staffPanel')
                                .setLabel('staff panel')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('🛠️'),
                        ),
                ],
                ephemeral: true,
            });
            await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_staffPanel', time: 60000 })
                .then(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                })
                .catch(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                });
        }
    },
};