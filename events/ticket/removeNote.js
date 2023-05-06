const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!['tickets_notes_remove', 'tickets_notes_remove_select'].includes(interaction.customId)) return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        if (interaction.customId == 'tickets_notes_remove_select') {
            const note = ticket.notes[interaction.values[0] - 1];
            ticket.notes.splice(ticket.notes.indexOf(note), 1);
            await ticket.save();
            // await interaction.deleteReply().catch(() => { return; } );
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`removed note \`\`${note.text}\`\` from this ticket`),
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
            });
            return await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_staffPanel', time: 60000 })
                .then(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                })
                .catch(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                });
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__remove a note__ *!***
> select a note to remove`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('tickets_notes_remove_select')
                            .setPlaceholder('select a note to remove')
                            .addOptions(ticket.notes.map((note, index) => new StringSelectMenuOptionBuilder().setLabel(`${index + 1}. ${note.text.length > 22 ? `${note.text.substring(0, 19)}...` : note.text}`).setValue(`${index + 1}`).setDescription(`added by ${interaction.guild.members.cache.find(m => m.id == note.author).user.tag}`))),
                    ),
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_notes_remove_select', time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};