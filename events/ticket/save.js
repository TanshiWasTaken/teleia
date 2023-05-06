const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_save') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        if (!ticket.saved) {
            ticket.saved = true;
            await ticket.save();
            // await interaction.deferReply().then(async () => { await interaction.deleteReply().catch(() => { return; }); }).catch(() => { return; });
            await interaction.channel.permissionOverwrites.edit(await interaction.guild.members.cache.find(m => m.id == ticket.author), { ViewChannel: null });
            await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`this ticket has been **saved** by ${interaction.user}\nthis ticket won't be visible to the person that opened it until it gets opened again`),
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_close')
                                .setLabel('close ticket')
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji('🔒'),
                            new ButtonBuilder()
                                .setCustomId('tickets_staffPanel')
                                .setLabel('staff panel')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('🛠️'),
                        ),
                ],
            });
        }
        else if (ticket.saved) {
            ticket.saved = false;
            await ticket.save();
            await interaction.channel.permissionOverwrites.edit(await interaction.guild.members.cache.find(m => m.id == ticket.author), { ViewChannel: true });
            await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`this ticket has been **opened** again by ${interaction.user}`),
                ],
            });
        }
    },
};