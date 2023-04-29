const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_sticky') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        if (!ticket.sticky) {
            ticket.sticky = true;
            await ticket.save();
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('this ticket is now sticky. staff members are not able to close this ticket until it gets unmaked as sticky'),
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
        else if (ticket.sticky) {
            ticket.sticky = false;
            await ticket.save();
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('this ticket is no longer sticky. staff members are now able to close this ticket'),
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