const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        switch (interaction.customId) {
        case 'tickets_support': case 'tickets_connections': case 'tickets_report': case 'tickets_appeal': {
            return await interaction.showModal(
                new ModalBuilder()
                    .setTitle('ticket')
                    .setCustomId('tickets_createModal')
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`tickets-${interaction.customId.split('_')[1].charAt(0).toUpperCase()}_createModal_input`)
                                    .setLabel('summary')
                                    .setRequired(true)
                                    .setPlaceholder('provide a short summary of your issue')
                                    .setMinLength(10)
                                    .setMaxLength(100)
                                    .setStyle(TextInputStyle.Paragraph),
                            ),
                    ),
            );
        }
        case 'tickets_close': {
            if (!interaction.member.roles.cache.find(r => ['1094017816941821994', '1094017845781868564'].includes(r.id)) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.WARNING_COLOUR)
                            .setDescription('you do not have permission to close tickets'),
                    ],
                    ephemeral: true,
                });
            }
            const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
            if (!ticket) return;
            if (!ticket.open) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.WARNING_COLOUR)
                            .setDescription('this ticket is already closing'),
                    ],
                    ephemeral: true,
                });
            }
            if (ticket.pinned) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.WARNING_COLOUR)
                            .setDescription('you cannot close a pinned ticket'),
                    ],
                    ephemeral: true,
                });
            }
            if (ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.WARNING_COLOUR)
                            .setDescription(`this ticket has been claimed by ${interaction.guild.members.cache.get(ticket.claimedBy).user}. only they can close this ticket`),
                    ],
                    ephemeral: true,
                });
            }
            return await interaction.showModal(
                new ModalBuilder()
                    .setTitle('close ticket')
                    .setCustomId('tickets_closeModal')
                    // -${interaction.channel.name.charAt(1)}${interaction.channel.name.charAt(interaction.channel.name.length - 1)}
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('tickets_closeModal_input')
                                    .setLabel('reason')
                                    .setRequired(true)
                                    .setPlaceholder('provide a reason for closing the ticket')
                                    .setMinLength(10)
                                    .setMaxLength(100)
                                    .setStyle(TextInputStyle.Paragraph),
                            ),
                    ),
            );
        }
        case 'tickets_notes_add': {
            const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
            if (!ticket) return;
            return await interaction.showModal(
                new ModalBuilder()
                    .setTitle('add note')
                    .setCustomId('tickets_notes_addModal')
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('tickets_notes_addModal_input')
                                    .setLabel('note')
                                    .setRequired(true)
                                    .setPlaceholder('provide a note')
                                    .setStyle(TextInputStyle.Paragraph),
                            ),
                    ),
            );
        }
        }
    },
};