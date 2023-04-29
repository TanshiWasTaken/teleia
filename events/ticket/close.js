const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../../schemas/ticket');
const transcripts = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_closeModal') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        /* ticket.open = false;
        ticket.channel = null;
        ticket.reason = interaction.components[0].components[0].value; */
        const audit = await interaction.guild.channels.cache.find(c => c.id === '1092602285286232095');
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.WARNING_COLOUR)
                    .setDescription(`this ticket will be closing in <t:${Math.floor(Date.now() / 1000) + 30}:R>`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tickets_cancelClose')
                            .setLabel('cancel')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🚫'),
                        new ButtonBuilder()
                            .setCustomId('tickets_confirmClose')
                            .setLabel('close now')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔒'),
                    ),
            ],
        });
        ticket.open = false;
        await ticket.save();
        await interaction.channel.awaitMessageComponent({ filter: i => ['tickets_cancelClose', 'tickets_confirmClose'].includes(i.customId), time: 30000 }).then(async i => {
            if (i.customId === 'tickets_confirmClose') {
                ticket.open = false;
                ticket.closedBy = interaction.user.id;
                ticket.reason = interaction.components[0].components[0].value;
                await ticket.updateOne({ $unset: { channel: '', sticky: '', locked: '' } });
                await ticket.save();
                const attachment = await transcripts.createTranscript(interaction.guild.channels.cache.find(c => c.id == ticket.channel), {
                    filename: `${ticket.id}.html`,
                    saveImages: true,
                    poweredBy: false,
                });
                await audit.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOUR)
                            .setDescription(`ticket closed by ${interaction.guild.members.cache.find(m => m.id == ticket.closedBy)} for reason: \`${ticket.reason}\``),
                    ],
                    files: [
                        attachment,
                    ],
                });
                return await interaction.channel.delete().catch(() => { return; });
            }
            ticket.open = true;
            await ticket.save();
            await interaction.deleteReply().catch(() => { return; });
            return await i.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`the closing of this ticket has been cancelled by ${i.user}`),
                ],
            });
        }).catch(async () => {
            ticket.open = false;
            ticket.closedBy = interaction.user.id;
            ticket.reason = interaction.components[0].components[0].value;
            await ticket.updateOne({ $unset: { channel: '', sticky: '', locked: '' } });
            await ticket.save();
            const attachment = await transcripts.createTranscript(interaction.guild.channels.cache.find(c => c.id == ticket.channel), {
                filename: `${ticket.id}.html`,
                saveImages: true,
                poweredBy: false,
            });
            await audit.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`ticket closed by ${interaction.guild.members.cache.find(m => m.id == ticket.closedBy)} for reason: \`${ticket.reason}\``),
                ],
                files: [
                    attachment,
                ],
            });
            return await interaction.channel.delete().catch(() => { return; });
        });
    },
};