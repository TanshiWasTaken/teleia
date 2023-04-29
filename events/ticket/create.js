const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const mongoose = require('mongoose');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_createModal' || !interaction.isModalSubmit()) return;
        const summary = interaction.components[0].components[0].value;
        const existing = await Ticket.findOne({ author: interaction.user.id, open: true });
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
            id: `${interaction.components[0].components[0].customId.split('-')[1].charAt(0).toLowerCase()}-${await Ticket.countDocuments({ category: interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'S' ? 'support' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'C' ? 'connections' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'R' ? 'report' : 'appeal' }) + 1}`,
            category: `${interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'S' ? 'support' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'C' ? 'connections' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'R' ? 'report' : 'appeal'}`,
            summary: summary,
            author: interaction.user.id,
            open: true,
            sticky: false,
            locked: false,
        });
        const channel = await interaction.guild.channels.create({
            name: `・${ticket.category.charAt(0)}＃${await Ticket.countDocuments({ category: interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'S' ? 'support' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'C' ? 'connections' : interaction.components[0].components[0].customId.split('-')[1].charAt(0) == 'R' ? 'report' : 'appeal' }) + 1}`,
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
        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`${interaction.user.username.toUpperCase()}'S TICKET\`***__ ***!*** . . .\n
✰ \`O1\` — **__describe your issue__ *!***
> while waiting for a staff member to respond, please describe your issue in as much detail as possible. this will help us resolve your issue faster
${ticket.category == 'report' ? `\n✰ \`O2\` — **__send evidence__ *!***
> please provide evidence supporting your accusations towards this person` : ''}`)
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
        await webhookClient.send({ content: summary }).then(async () => { await webhookClient.delete(); });
    },
};