const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'tickets_users') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__users__ *!***
> ${ticket.users.length > 0 ? ticket.users.map((user, index) => `**${index + 1}.** ${interaction.guild.members.cache.find(m => m.id == ticket.users[index])} (${interaction.guild.members.cache.find(m => m.id == ticket.users[index]).id})`).join('\n> ') : 'there are no users'}`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tickets_users_back')
                            .setLabel('back')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('◀️'),
                        new ButtonBuilder()
                            .setCustomId('tickets_users_add')
                            .setLabel('add')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(ticket.users.length > 24)
                            .setEmoji('👤'),
                        new ButtonBuilder()
                            .setCustomId('tickets_users_remove')
                            .setLabel('remove')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(ticket.users.length < 1)
                            .setEmoji('🗑️'),
                    ),
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && ['tickets_users_back', 'tickets_users_add', 'tickets_users_remove'].includes(i.customId), time: 60000 })
            .then(async (i) => {
                if (i.customId == 'tickets_users_back') {
                    i.customId = 'tickets_staffPanel_select';
                    if (ticket.pinned) {
                        i.values = ['2'];
                    }
                    if (ticket.saved && ticket.pinned) {
                        i.values = ['2'];
                    }
                    if (!ticket.pinned) {
                        i.values = ['3'];
                    }
                    i.client.emit('interactionCreate', i);
                }
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};