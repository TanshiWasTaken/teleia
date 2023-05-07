const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../../schemas/ticket');
// const transcripts = require('discord-html-transcripts');

async function close(ticket, interaction, audit) {
    ticket.closedBy = interaction.user.id;
    ticket.summary = interaction.components[0].components[0].value;
    await ticket.updateOne({ $unset: { channel: '', pinned: '', archived: '' } });
    await ticket.save();
    /* const attachment = await transcripts.createTranscript(interaction.guild.channels.cache.find(c => c.id == ticket.channel), {
        filename: `${ticket.id}.html`,
        saveImages: true,
        poweredBy: false,
    }); */
    await audit.send({
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.COLOUR)
                .setDescription(`⸝⸝ ★ __***\`TICKET CLOSED\`***__ ***!*** . . .\n
✰ \`O1\` — **__ticket info__ *!***
> ・**ticket id:** \`${ticket.id}\`
> ・**opened by:** ${interaction.guild.members.cache.find(m => m.id == ticket.author)}
> ・**handled by:** ${ticket.handledBy.map(m => `<@${m}>`).join(', ') || 'nobody'}
> ・**closed by:** ${interaction.guild.members.cache.find(m => m.id == ticket.closedBy)}
> ・**summary:** \`${ticket.summary}\`${ticket.notes.length > 0 ? `\n> ・**notes:** ||${ticket.notes.map((n, index) => `**${index + 1}.** \`"${n.text}"\` (${interaction.guild.members.cache.find(m => m.id == n.author)})`).join('\n> ')}||` : ''}

✰ \`O2\` — **__transcript__ *!***
> you can view the transcript of this ticket by clicking the button below!`),
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('view transcript')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://youtube.com'),
                ),
        ],
    });
    await interaction.channel.delete().catch(() => { return; });
    let welcomeMessage;
    if (interaction.guild.members.cache.find(m => m.id == ticket.author).roles.cache.has('1094017909879230545')) {
        welcomeMessage = await interaction.guild.channels.cache.find(c => c.id == '1092208484600262686').send({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`NEW USER JOINED\`***__ ***!*** . . .\n
✰ \`O1\` — **__<@&1096562162379534467>, <@${ticket.author}>__ *!***
> ・introduce yourself in <#1092208309517418626>
> ・grab some optional <#1092208297748217896>
> ・set your birthday by running \`/bday set\` in <#1092213066722201660>

✰ \`O2\` — **__need help__ *?***
> go to the <#1092208211714637864> channel to open a ticket`),
            ],
        });
        welcomeMessage.react('❤️');
    }
    await interaction.guild.members.cache.find(m => m.id == ticket.author).send({
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.COLOUR)
                .setDescription(`⸝⸝ ★ __***\`TICKET CLOSED\`***__ ***!*** . . .\n
✰ \`O1\` — **__ticket info__ *!***
> ・**ticket id:** \`${ticket.id}\`
> ・**handled by:** ${ticket.handledBy.map(m => `<@${m}>`).join(', ') || 'nobody'}
> ・**closed by:** ${interaction.guild.members.cache.find(m => m.id == ticket.closedBy)}
> ・**summary:** \`${ticket.summary}\`
${interaction.guild.members.cache.find(m => m.id == ticket.author).roles.cache.has('1094017909879230545') ? `\n✰ \`O2\` — **__welcome to our community__ *!***
> go check your welcome message in the main chat [here](${welcomeMessage.url})\n` : ''}
✰ \`O3\` — **__how was your experience__ *?***
> you can leave an anonymous rating of your experience to help improve our support service! this rating will only be shown in charts, and will not be linked to your name.`),
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_rate_1')
                        .setLabel('★')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('tickets_rate_2')
                        .setLabel('★')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('tickets_rate_3')
                        .setLabel('★')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('tickets_rate_4')
                        .setLabel('★')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('tickets_rate_5')
                        .setLabel('★')
                        .setStyle(ButtonStyle.Secondary),
                ),
        ],
    }).catch(async () => { return; });
}

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_closeModal') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
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
                return await close(ticket, interaction, audit);
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
            return await close(ticket, interaction, audit);
        });
    },
};