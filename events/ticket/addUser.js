const { EmbedBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'tickets_users_add') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        const audit = await interaction.guild.channels.cache.find(c => c.id === '1092602285286232095');
        if (!ticket) return;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription('please mention the user you want to add to this ticket'),
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1, time: 60000 })
            .then(async (m) => {
                const user = m.first().mentions.users.first();
                m.first().delete().catch(() => { return; });
                if (!user) {
                    await interaction.deleteReply().catch(() => { return; });
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.WARNING_COLOUR)
                                .setDescription('you did not mention a user'),
                        ],
                        ephemeral: true,
                    });
                    return;
                }
                if (ticket.users.includes(user.id)) {
                    await interaction.deleteReply().catch(() => { return; });
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.WARNING_COLOUR)
                                .setDescription('that user is already in this ticket'),
                        ],
                        ephemeral: true,
                    });
                    return;
                }
                ticket.users.push(user.id);
                await ticket.save();
                await interaction.channel.permissionOverwrites.edit(await interaction.guild.members.cache.find(u => u.id == user.id), { ViewChannel: true });
                await interaction.deleteReply().catch(() => { return; });
                await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOUR)
                            .setDescription(`added user ${user} to this ticket`),
                    ],
                });
                await audit.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOUR)
                            .setDescription(`⸝⸝ ★ __***\`TICKET UPDATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a user was added__ *!***
> ・**ticket:** ${interaction.channel}
> ・**user:** ${interaction.guild.members.cache.find(m1 => m1.id == ticket.users[ticket.users.length - 1])}
> ・**added by:** ${interaction.user}`),
                    ],
                });
                /* await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'tickets_staffPanel', time: 60000 })
                    .then(async () => {
                        await interaction.deleteReply().catch(() => { return; });
                    })
                    .catch(async () => {
                        await interaction.deleteReply().catch(() => { return; });
                    }); */
            });
    },
};