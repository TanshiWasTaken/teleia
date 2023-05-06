const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'verification2_2') return;
        const ticket = await Ticket.findOne({ author: interaction.user.id, category: 'verify', open: true, saved: false });
        if (ticket) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.WARNING_COLOUR)
                        .setDescription(`you already have an open verification ticket in <#${ticket.channel}>`),
                ],
            });
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
✰ \`O6\` — **__open a ticket__ *!***
> open a ticket to get manually verified by a staff member. in the ticket you will be needed to answer a short series of questions.`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tickets_verify')
                            .setLabel('open ticket')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🎫'),
                    ),
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_verify', time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};