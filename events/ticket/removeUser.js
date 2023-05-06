const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!['tickets_users_remove', 'tickets_users_remove_select'].includes(interaction.customId)) return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        if (interaction.customId == 'tickets_users_remove_select') {
            const user = ticket.users[interaction.values[0] - 1];
            ticket.users.splice(ticket.users.indexOf(user), 1);
            await ticket.save();
            await interaction.channel.permissionOverwrites.edit(await interaction.guild.members.cache.find(m => m.id == user), { ViewChannel: null });
            // await interaction.deleteReply().catch(() => { return; } );
            await interaction.channel.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`removed user ${interaction.guild.members.cache.find(u => u.id == user)} from this ticket`),
                ],
            });
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__remove a user__ *!***
> select a user to remove`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('tickets_users_remove_select')
                            .setPlaceholder('select a user to remove')
                            .addOptions(ticket.users.map((user, index) => new StringSelectMenuOptionBuilder().setLabel(`${index + 1}. ${interaction.guild.members.cache.find(u => u.id == user).user.tag.length > 22 ? `${interaction.guild.members.cache.find(u => u.id == user).user.tag.substring(0, 19)}...}` : interaction.guild.members.cache.find(u => u.id == user).user.tag}`).setValue(`${index + 1}`))),
                    ),
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_users_remove_select', time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};