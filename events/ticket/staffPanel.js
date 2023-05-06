const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!['tickets_staffPanel', 'tickets_staffPanel_select'].includes(interaction.customId)) return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        const pages = [
            ticket.pinned ? new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_pin')
                        .setLabel('unpin')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('📌'),
                    new ButtonBuilder()
                        .setCustomId('tickets_save')
                        .setLabel(ticket.saved ? 'open' : 'save')
                        .setStyle(ticket.saved ? ButtonStyle.Success : ButtonStyle.Primary)
                        .setEmoji(ticket.saved ? '🔓' : '💾'),
                    new ButtonBuilder()
                        .setCustomId('tickets_claim')
                        .setLabel(`${ticket.claimedBy == interaction.user.id ? 'unclaim' : 'claim'}`)
                        .setDisabled(ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋'),
                ) : new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_save')
                        .setLabel(ticket.saved ? 'open' : 'save')
                        .setStyle(ticket.saved ? ButtonStyle.Success : ButtonStyle.Primary)
                        .setEmoji(ticket.saved ? '🔓' : '💾'),
                    new ButtonBuilder()
                        .setCustomId('tickets_close')
                        .setLabel('close')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒'),
                    new ButtonBuilder()
                        .setCustomId('tickets_claim')
                        .setLabel(`${ticket.claimedBy == interaction.user.id ? 'unclaim' : 'claim'}`)
                        .setDisabled(ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋'),
                ),
            ticket.pinned ? new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_userInfo')
                        .setLabel('user info')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🪪'),
                    new ButtonBuilder()
                        .setCustomId('tickets_notes')
                        .setLabel('notes')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📝'),
                    new ButtonBuilder()
                        .setCustomId('tickets_users')
                        .setLabel('users')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('👥'),
                ) : new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_pin')
                        .setLabel('pin')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📌'),
                    new ButtonBuilder()
                        .setCustomId('tickets_userInfo')
                        .setLabel('user info')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🪪'),
                    new ButtonBuilder()
                        .setCustomId('tickets_notes')
                        .setLabel('notes')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📝'),
                ),
        ];
        if (ticket.saved && ticket.pinned) {
            pages[0] = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_pin')
                        .setLabel('unpin')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('📌'),
                    new ButtonBuilder()
                        .setCustomId('tickets_save')
                        .setLabel('open')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('🔓'),
                    new ButtonBuilder()
                        .setCustomId('tickets_claim')
                        .setLabel(`${ticket.claimedBy == interaction.user.id ? 'unclaim' : 'claim'}`)
                        .setDisabled(ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋'),
                );
            pages[1] = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_userInfo')
                        .setLabel('user info')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🪪'),
                    new ButtonBuilder()
                        .setCustomId('tickets_notes')
                        .setLabel('notes')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📝'),
                    new ButtonBuilder()
                        .setCustomId('tickets_users')
                        .setLabel('users')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('👥'),
                );
        }
        const paginator = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('tickets_staffPanel_select')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('page 1')
                            .setValue('1')
                            .setDefault(interaction.values && interaction.values[0] == '1' ? true : false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('page 2')
                            .setValue('2')
                            .setDefault(interaction.values && interaction.values[0] == '2' ? true : false),
                    ),
            );
        if (!ticket.pinned) {
            pages.push(new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_users')
                        .setLabel('users')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('👥'),
                ));
            paginator.components[0].addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('page 3')
                    .setValue('3')
                    .setDefault(interaction.values && interaction.values[0] == '3' ? true : false),
            );
        }
        if (!interaction.member.roles.cache.find(r => ['1094017816941821994', '1094017845781868564'].includes(r.id)) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.WARNING_COLOUR)
                        .setDescription('only staff members can access this panel'),
                ],
                ephemeral: true,
            });
        }
        if (!ticket.handledBy.includes(interaction.user.id) && interaction.user.id !== ticket.author) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.WARNING_COLOUR)
                        .setDescription('you are not handling this ticket. send a message to be able to access this panel'),
                ],
                ephemeral: true,
            });
        }
        if (!ticket.open) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.WARNING_COLOUR)
                        .setDescription('this ticket is closing. cancel the closing in order to access the staff panel'),
                ],
                ephemeral: true,
            });
        }
        if (interaction.customId === 'tickets_staffPanel_select') {
            switch (interaction.values[0]) {
            case '1': {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOUR)
                            .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__what would you like to do__ *?***
> this is the staff panel for tickets, you can manage this ticket using the buttons below`),
                    ],
                    components: [
                        pages[0],
                        paginator,
                    ],
                    ephemeral: true,
                });
                break;
            }
            case '2': {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOUR)
                            .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__what would you like to do__ *?***
> this is the staff panel for tickets, you can manage this ticket using the buttons below`),
                    ],
                    components: [
                        pages[1],
                        paginator,
                    ],
                    ephemeral: true,
                });
                break;
            }
            case '3': {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOUR)
                            .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__what would you like to do__ *?***
> this is the staff panel for tickets, you can manage this ticket using the buttons below`),
                    ],
                    components: [
                        pages[2],
                        paginator,
                    ],
                    ephemeral: true,
                });
                break;
            }
            }
            return await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && ['tickets_save', 'tickets_close', 'tickets_claim', 'tickets_pin', 'tickets_userInfo', 'tickets_staffPanel', 'tickets_staffPanel_select', 'tickets_notes', 'tickets_users'].includes(i.customId), time: 60000 })
                .then(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                })
                .catch(async () => {
                    await interaction.deleteReply().catch(() => { return; });
                });
        }
        await paginator.components[0].options[0].setDefault(true);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`STAFF PANEL\`***__ ***!*** . . .\n
✰ \`O1\` — **__what would you like to do__ *?***
> this is the staff panel for tickets, you can manage this ticket using the buttons below`),
            ],
            components: [
                pages[0],
                paginator,
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && ['tickets_save', 'tickets_close', 'tickets_claim', 'tickets_pin', 'tickets_userInfo', 'tickets_staffPanel', 'tickets_staffPanel_select', 'tickets_notes', 'tickets_users'].includes(i.customId), time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};