const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_claim') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        if (ticket.claimedBy == undefined) {
            ticket.claimedBy = interaction.user.id;
            await ticket.save();
            await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`this ticket has been claimed by ${interaction.user}`),
                ],
            });
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('you have claimed this ticket. you are now the only one who can close this ticket'),
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
        else if (ticket.claimedBy == interaction.user.id) {
            await ticket.updateOne({ $unset: { claimedBy: '' } });
            await ticket.save();
            await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`this ticket has been unclaimed by ${interaction.user}`),
                ],
            });
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('you have unclaimed this ticket. any staff member can now close this ticket'),
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