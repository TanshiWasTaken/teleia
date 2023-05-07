const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
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
                        .setDescription(`this ticket has been **saved** by ${interaction.user}. this ticket won't be visible to the person that opened it until it gets opened again`),
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
                        .setDescription(`this ticket has been **reopened** by ${interaction.user}`),
                ],
            });
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`you have **${ticket.saved ? 'saved' : 'reopened'}** this ticket. ${ticket.saved ? 'this ticket won\'t be visible to the person that opened it until it gets opened again' : ''}`),
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
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id == interaction.user.id && i.customId == 'tickets_staffPanel', componentType: ComponentType.Button, time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};