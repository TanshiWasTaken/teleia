const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_staffPanel') return;
        if (!interaction.member.roles.cache.find(r => ['1094017816941821994', '1094017845781868564'].includes(r.id)) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.WARNING_COLOUR)
                        .setDescription('only staff members can access this panel'),
                ],
                ephemeral: true,
            });
        }
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket.handledBy.includes(interaction.user.id) && interaction.user.id !== ticket.author) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.WARNING_COLOUR)
                        .setDescription('you are not handling this ticket. send a message to be able to access this panel'),
                ],
                ephemeral: true,
            });
        }
        if (!ticket.open) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.WARNING_COLOUR)
                        .setDescription('this ticket is closing. cancel the closing in order to access the staff panel'),
                ],
                ephemeral: true,
            });
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__what would you like to do__ *?***
> this is the staff panel for tickets, you can manage this ticket using the buttons below`),
            ],
            components: [
                ticket.sticky ? new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tickets_sticky')
                            .setLabel('unmark as sticky')
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('🗃️'),
                        new ButtonBuilder()
                            .setCustomId('tickets_claim')
                            .setLabel(`${ticket.claimedBy == interaction.user.id ? 'unclaim' : 'claim'} ticket`)
                            .setDisabled(ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🙋'),
                        new ButtonBuilder()
                            .setCustomId('tickets_userInfo')
                            .setLabel('user info')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🪪'),
                    ) : new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tickets_save')
                            .setLabel(ticket.locked ? 'open ticket' : 'close & keep')
                            .setStyle(ticket.locked ? ButtonStyle.Success : ButtonStyle.Primary)
                            .setEmoji(ticket.locked ? '🔓' : '💾'),
                        new ButtonBuilder()
                            .setCustomId('tickets_close')
                            .setLabel('close ticket')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔒'),
                        new ButtonBuilder()
                            .setCustomId('tickets_claim')
                            .setLabel(`${ticket.claimedBy == interaction.user.id ? 'unclaim' : 'claim'} ticket`)
                            .setDisabled(ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🙋'),
                        new ButtonBuilder()
                            .setCustomId('tickets_sticky')
                            .setLabel('mark as sticky')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🗃️'),
                        new ButtonBuilder()
                            .setCustomId('tickets_userInfo')
                            .setLabel('user info')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🪪'),
                    ),
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && ['tickets_save', 'tickets_close', 'tickets_claim', 'tickets_sticky', 'tickets_userInfo', 'tickets_staffPanel'].includes(i.customId), time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};