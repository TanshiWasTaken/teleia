const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const mongoose = require('mongoose');
const StatsTickets = require('../../schemas/stats_tickets');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_createModal' || !interaction.isModalSubmit()) return;
        const reason = interaction.components[0].components[0].value;
        const existing = await Ticket.findOne({ author: interaction.user.id, open: true, saved: false });
        if (existing) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.WARNING_COLOUR)
                        .setDescription(`you already have a ticket open: <#${existing.channel}>`),
                ],
                ephemeral: true,
            });
        }
        const ticket = new Ticket({
            _id: new mongoose.Types.ObjectId(),
            id: `${interaction.components[0].components[0].customId.split('-')[1].charAt(0).toLowerCase()}-${await Ticket.countDocuments({ category: interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'S' ? 'support' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'C' ? 'connections' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'R' ? 'report' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'A' ? 'appeal' : 'verify' }) + 1}`,
            category: `${interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'S' ? 'support' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'C' ? 'connections' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'R' ? 'report' : 'appeal'}`,
            reason: reason,
            author: interaction.user.id,
            open: true,
            pinned: false,
            archived: false,
        });
        const channel = await interaction.guild.channels.create({
            name: `・${ticket.category.charAt(0)}＃${await Ticket.countDocuments({ category: interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'S' ? 'support' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'C' ? 'connections' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'R' ? 'report' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'A' ? 'appeal' : 'verify' }) + 1}`,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });
        ticket.channel = channel.id;
        await ticket.save();
        await channel.setParent('1092188385583579256');

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`ticket created: ${channel}`),
            ],
            ephemeral: true,
        });
        await channel.send({ content: '<@&1094017845781868564> <@&1094017816941821994>' }).then(m => m.delete().catch(() => { return; }));
        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`${interaction.user.username.toUpperCase()}'S TICKET\`***__ ***!*** . . .\n
${ticket.category == 'support' ?
        `✰ \`O1\` — **__describe your issue__ *!***
> while waiting for a staff member's response, please describe your issue in as much detail as possible. this will help us resolve your issue faster.`
        : ticket.category == 'connections' ?
            `✰ \`O1\` — **__connect with us__ *!***
> while waiting for a staff member's response, please send your server ad and make sure your server fits the requirements in ${interaction.guild.channels.cache.find(c => c.id == '1092208203267321976')}. this will make the process faster.`
            : ticket.category == 'report' ?
                `✰ \`O1\` — **__report something__ *!***
> while waiting for a staff member's response, please provide evidence and information regarding what you are reporting. this will help us take action more efficiently.`
                : ticket.category == 'appeal' ?
                    `✰ \`O1\` — **__appeal a strike__ *!***
> while waiting for a staff member's response, please tell us when and why you were given a strike. this will help us handle your appeal more efficiently.`
                    : `✰ \`O1\` — **__finish verifying__ *!***
> while waiting for a staff member's response, please answer the questions below.`}`)
                    .setThumbnail('https://th.bing.com/th/id/R.55b2b783c01b21a5f0b9c8bea8041723?rik=sIPz2agCmNLraQ&pid=ImgRaw&r=0'),
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
        const webhook = await interaction.guild.channels.createWebhook({
            channel: channel.id,
            name: interaction.member.displayName,
            avatar: interaction.member.displayAvatarURL({ dynamic: true, size: 4096 }),
        });
        const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
        await webhookClient.send({ content: reason }).then(async () => { await webhookClient.delete(); });
        const stats = await StatsTickets.findOne();
        if (!stats) {
            await StatsTickets.create({
                _id: new mongoose.Types.ObjectId(),
                nTickets: 0,
                nSupport: 0,
                nConnections: 0,
                nReport: 0,
                nAppeal: 0,
                nVerify: 0,
                bad: 0,
                veryBad: 0,
                neutral: 0,
                good: 0,
                veryGood: 0,
            });
        }
        stats.nTickets++;
        ticket.category == 'support' ? stats.nSupport++ : ticket.category == 'connections' ? stats.nConnections++ : ticket.category == 'report' ? stats.nReport++ : ticket.category == 'appeal' ? stats.nAppeal++ : stats.nVerify++;
        await stats.save();
        const audit = await interaction.guild.channels.cache.find(c => c.id === '1092602285286232095');
        return await audit.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`TICKET CREATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a ticket was created__ *!***
> ・**ticket:** ${interaction.guild.channels.cache.find(c => c.id == ticket.channel)} (\`${ticket.id}\`)
> ・**category:** ${ticket.category}
> ・**opened by:** ${interaction.user}
> ・**reason:** \`\`${ticket.reason}\`\``),
            ],
        });
    },
};