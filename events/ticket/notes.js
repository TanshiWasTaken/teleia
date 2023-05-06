const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'tickets_notes') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__notes__ *!***
> ${ticket.notes.length > 0 ? ticket.notes.map((note, index) => `**${index + 1}.** \`\`${note.text}\`\` (${interaction.guild.members.cache.find(m => m.id == note.author).user.tag})`).join('\n> ') : 'there are no notes'}`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tickets_notes_back')
                            .setLabel('back')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('◀️'),
                        new ButtonBuilder()
                            .setCustomId('tickets_notes_add')
                            .setLabel('add')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(ticket.notes.length > 24)
                            .setEmoji('📝'),
                        new ButtonBuilder()
                            .setCustomId('tickets_notes_remove')
                            .setLabel('remove')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(ticket.notes.length < 1)
                            .setEmoji('🗑️'),
                    ),
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && ['tickets_notes_back', 'tickets_notes_add', 'tickets_notes_remove'].includes(i.customId), time: 60000 })
            .then(async (i) => {
                if (i.customId == 'tickets_notes_back') {
                    i.customId = 'tickets_staffPanel_select';
                    i.values = ['2'];
                    i.client.emit('interactionCreate', i);
                }
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};