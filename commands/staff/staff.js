const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, PermissionsBitField } = require('discord.js');
const mongoose = require('mongoose');
const StatsTickets = require('../../schemas/stats_tickets');
const Ticket = require('../../schemas/ticket');
const Embed = require('../../schemas/embed');
const embed = new EmbedBuilder()
    .setColor(process.env.COLOUR);
async function description(interaction) {
    await interaction.reply({ content: 'send a description below. type `cancel` to cancel the edit', ephemeral: true });
    await interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 })
        .then(async collected => {
            if (collected.first().content.toLowerCase() == 'cancel') { await collected.first().delete().catch(() => { return; }); return await interaction.deleteReply().catch(() => { return; }); }
            await collected.first().delete().catch(() => { return; });
            await interaction.deleteReply().catch(() => { return; });
            embed.setDescription(collected.first().content);
        }).catch(() => { return; });
}
async function image(interaction) {
    await interaction.reply({ content: 'send an image or a link to one below. type `remove` to remove the image or type `cancel` to cancel the edit.', ephemeral: true });
    await interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 })
        .then(async collected => {
            if (collected.first().content.toLowerCase() == 'remove') { await collected.first().delete().catch(() => { return; }); await interaction.deleteReply().catch(() => { return; }); return embed.setImage(); }
            else if (collected.first().content.toLowerCase() == 'cancel') { await collected.first().delete().catch(() => { return; }); return await interaction.deleteReply().catch(() => { return; }); }
            const regex = /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?.(jpg|jpeg|gif|png)(\?(.*))?$/g.exec(collected.first().content);
            if (collected.first().attachments.first()?.url && collected.first().attachments.first()?.contentType.startsWith('image')) { embed.setImage(collected.first().attachments.first()?.url); }
            else if (regex) { embed.setImage(regex[0]); }
            else if (collected.first().attachments.first() && !collected.first().attachments.first().contentType.startsWith('image')) { await interaction.followUp({ content: 'videos, audios or anything else other than an image or gif cannot be used as an image.', ephemeral: true }); }
            else if (!collected.first().attachments.first()?.url && !regex) { await interaction.followUp({ content: 'no attachment or link was found', ephemeral: true }); }
            await collected.first().delete().catch(() => { return; });
            await interaction.deleteReply().catch(() => { return; });
        }).catch(() => { return; });
}
async function thumbnail(interaction) {
    await interaction.reply({ content: 'send an image or a link to one below. type `remove` to remove the thumbnail or type `cancel` to cancel the edit', ephemeral: true });
    await interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 })
        .then(async collected => {
            if (collected.first().content.toLowerCase() == 'remove') { await collected.first().delete().catch(() => { return; }); await interaction.deleteReply().catch(() => { return; }); return embed.setThumbnail(); }
            else if (collected.first().content.toLowerCase() == 'cancel') { await collected.first().delete().catch(() => { return; }); return await interaction.deleteReply().catch(() => { return; }); }
            const regex = /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?.(jpg|jpeg|gif|png)(\?(.*))?$/g.exec(collected.first().content);
            if (collected.first().attachments.first()?.url && collected.first().attachments.first()?.contentType.startsWith('image')) { embed.setThumbnail(collected.first().attachments.first()?.url); }
            else if (regex) { embed.setThumbnail(regex[0]); }
            else if (collected.first().attachments.first() && !collected.first().attachments.first().contentType.startsWith('image')) { await interaction.followUp({ content: 'videos, audios or anything else other than an image or gif cannot be used as a thumbnail.', ephemeral: true }); }
            else if (!collected.first().attachments.first()?.url && !regex) { await interaction.followUp({ content: 'no attachment or link was found', ephemeral: true }); }
            await collected.first().delete().catch(() => { return; });
            await interaction.deleteReply().catch(() => { return; });
        }).catch(() => { return; });
}
async function footer(interaction) {
    await interaction.reply({ content: 'send a footer below. type `remove` to remove the footer or type `cancel` to cancel the edit', ephemeral: true });
    await interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 })
        .then(async collected => {
            if (collected.first().content.toLowerCase() == 'cancel') { await collected.first().delete().catch(() => { return; }); return await interaction.deleteReply().catch(() => { return; }); }
            if (collected.first().content.toLowerCase() == 'remove') { await collected.first().delete().catch(() => { return; }); await interaction.deleteReply().catch(() => { return; }); return embed.setFooter(null); }
            await collected.first().delete().catch(() => { return; });
            await interaction.deleteReply().catch(() => { return; });
            embed.setFooter({ text: collected.first().content });
        }).catch(() => { return; });
}
async function update_embed(interaction) {
    return await interaction.editReply({
        embeds: [embed],
    }).catch(() => { return; });
}
async function select_callback(interaction, i) {
    switch (interaction.options.getSubcommand()) {
    default: {
        switch (i.values[0]) {
        case 'description': {
            await description(i);
            break;
        }
        case 'image': {
            await image(i);
            break;
        }
        case 'thumbnail': {
            await thumbnail(i);
            break;
        }
        case 'footer': {
            await footer(i);
            break;
        }
        }
        await update_embed(interaction);
        break;
    }
    }
}
async function button_callback(interaction, i, editEmbed) {
    switch (interaction.options.getSubcommand()) {
    case 'create': {
        switch (i.customId) {
        case 'cancel': {
            await interaction.deleteReply().catch(() => { return; });
            embed.setFooter(null);
            break;
        }
        case 'finish': {
            await interaction.deleteReply().then(await interaction.channel.send({ embeds: [embed] })).catch(() => { return; });
            const newEmbed = new Embed({
                _id: new mongoose.Types.ObjectId(),
                name: interaction.options.getString('name'),
                content: embed.data.description,
                thumbnail: embed.data?.thumbnail?.url,
                image: embed.data?.image?.url,
                footer: embed.data?.footer?.text,
            });
            await newEmbed.save();
            embed.setThumbnail();
            embed.setImage();
            embed.setFooter(null);
            break;
        }
        }
        break;
    }
    case 'edit': {
        switch (i.customId) {
        case 'cancel': {
            await interaction.deleteReply().catch(() => { return; });
            break;
        }
        case 'finish': {
            await interaction.deleteReply().then(await interaction.channel.send({ embeds: [embed] }));
            editEmbed.content = embed.data.description;
            editEmbed.thumbnail = embed.data?.thumbnail?.url;
            editEmbed.image = embed.data?.image?.url;
            editEmbed.footer = embed.data?.footer?.text;
            await editEmbed.save();
            embed.setThumbnail();
            embed.setImage();
            embed.setFooter(null);
            break;
        }
        }
    }
    }
}
async function button_pages(interaction, pages, time = 60000) {
    const embeds = new EmbedBuilder()
        .setColor(process.env.COLOUR);
    if (pages.length === 1) {
        const page = await interaction.reply({
            embeds: [embeds.setDescription(`⸝⸝ ★ __***\`EMBEDS\`***__ ***!*** . . .\n\n> ・${pages[0]}`)],
            components: [],
            fetchReply: true,
        });
        return page;
    }
    const home = new ButtonBuilder()
        .setCustomId('home')
        .setEmoji('⏮️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);
    const prev = new ButtonBuilder()
        .setCustomId('prev')
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);
    const next = new ButtonBuilder()
        .setCustomId('next')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Secondary);
    const last = new ButtonBuilder()
        .setCustomId('last')
        .setEmoji('⏭️')
        .setStyle(ButtonStyle.Secondary);
    const buttonRow = new ActionRowBuilder()
        .addComponents(home, prev, next, last);
    let index = 0;
    const currentPage = await interaction.reply({
        embeds: [embeds.setDescription(`⸝⸝ ★ __***\`EMBEDS\`***__ ***!*** . . .\n\n> ・${pages[index]}`).setFooter({ text: `Page ${index + 1} / ${pages.length}` })],
        components: [buttonRow],
        fetchReply: true,
    });
    const collector = await currentPage.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        time: time,
    });
    collector.on('collect', async i => {
        await i.deferUpdate();
        switch (i.customId) {
        case 'home': {
            index = 0;
            home.setDisabled(true);
            prev.setDisabled(true);
            next.setDisabled(false);
            last.setDisabled(false);
            break;
        }
        case 'prev': {
            index--;
            home.setDisabled(index === 0);
            prev.setDisabled(index === 0);
            next.setDisabled(false);
            last.setDisabled(false);
            break;
        }
        case 'next': {
            index++;
            home.setDisabled(false);
            prev.setDisabled(false);
            next.setDisabled(index + 1 === pages.length);
            last.setDisabled(index + 1 === pages.length);
            break;
        }
        case 'last': {
            index = pages.length - 1;
            home.setDisabled(false);
            prev.setDisabled(false);
            next.setDisabled(true);
            last.setDisabled(true);
            break;
        }
        }
        await currentPage.edit({
            embeds: [embeds.setDescription(`⸝⸝ ★ __***\`EMBEDS\`***__ ***!*** . . .\n\n> ・${pages[index]}`).setFooter({ text: `Page ${index + 1} / ${pages.length}` })],
            components: [buttonRow],
        });
        await collector.resetTimer();
    });
    collector.on('end', async () => {
        await currentPage.edit({
            components: [],
        }).catch(() => { return; });
    });
    return currentPage;
}
const select = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('fields')
            .setPlaceholder('Select a field to edit')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Description')
                    .setValue('description')
                    .setDescription('Edit the content of the embed')
                    .setEmoji('📝'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Image')
                    .setValue('image')
                    .setDescription('Edit the image of the embed')
                    .setEmoji('📷'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Thumbnail')
                    .setValue('thumbnail')
                    .setDescription('Edit the thumbnail of the embed')
                    .setEmoji('🖼️'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Footer')
                    .setValue('footer')
                    .setDescription('Edit the footer of the embed')
                    .setEmoji('🦶'),
            ),
    );
const buttons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('finish')
            .setLabel('Finish')
            .setStyle(ButtonStyle.Primary),
    );

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staff')
        .setDescription('staff commands')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .addSubcommandGroup(group =>
            group
                .setName('embed')
                .setDescription('manipulate embeds')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('create')
                        .setDescription('creates an embed')
                        .addStringOption(option =>
                            option
                                .setName('name')
                                .setDescription('the name of the embed')
                                .setRequired(true),
                        )
                        .addStringOption(option =>
                            option
                                .setName('content')
                                .setDescription('the content of the embed')
                                .setRequired(false),
                        )
                        .addAttachmentOption(option =>
                            option
                                .setName('thumbnail')
                                .setDescription('the thumbnail of the embed')
                                .setRequired(false),
                        )
                        .addAttachmentOption(option =>
                            option
                                .setName('image')
                                .setDescription('the image of the embed')
                                .setRequired(false),
                        )
                        .addStringOption(option =>
                            option
                                .setName('footer')
                                .setDescription('the footer of the embed')
                                .setRequired(false),
                        ),
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('list')
                        .setDescription('lists all the embeds'),
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('edit')
                        .setDescription('edits an embed')
                        .addStringOption(option =>
                            option
                                .setName('name')
                                .setDescription('the name of the embed to edit')
                                .setRequired(true),
                        ),
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('delete')
                        .setDescription('deletes an embed')
                        .addStringOption(option =>
                            option
                                .setName('name')
                                .setDescription('the name of the embed to delete')
                                .setRequired(true),
                        ),
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('send')
                        .setDescription('sends an embed')
                        .addStringOption(option =>
                            option
                                .setName('name')
                                .setDescription('the name of the embed to send')
                                .setRequired(true),
                        ),
                ),
        )
        .addSubcommandGroup(group =>
            group
                .setName('stats')
                .setDescription('get statistics')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('tickets')
                        .setDescription('get ticket statistics'),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('clears messages from a channel')
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('amount of messages to clear')
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true),
                ),
        )
        .addSubcommandGroup(group =>
            group
                .setName('tickets')
                .setDescription('tickets staff commands')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('panel')
                        .setDescription('opens the staff panel for tickets'),
                ),
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommandGroup()) {
        case 'embed': {
            switch (interaction.options.getSubcommand()) {
            case 'create': {
                if (await Embed.findOne({ name: interaction.options.getString('name') })) return await interaction.reply({ embeds: [embed.setDescription(`an embed with the name \`${interaction.options.getString('name')}\` already exists`)] });
                interaction.options.getAttachment('thumbnail')?.attachment ? embed.setThumbnail(interaction.options.getAttachment('thumbnail')?.attachment) : 0;
                interaction.options.getAttachment('image')?.attachment ? embed.setImage(interaction.options.getAttachment('image')?.attachment) : 0;
                interaction.options.getString('footer') ? embed.setFooter(interaction.options.getString('footer')) : 0;
                await interaction.reply({
                    embeds: [interaction.options.getString('content') ? embed.setDescription(interaction.options.getString('content')) : embed.setDescription('placeholder content')],
                    components: [select, buttons],
                });
                const filter = i => i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter });

                collector.on('collect', async i => {
                    if (i.isStringSelectMenu()) {
                        await select_callback(interaction, i);
                    }
                    else if (i.isButton()) {
                        await collector.stop();
                        return await button_callback(interaction, i);
                    }
                });
                break;
            }
            case 'list': {
                const embeds = await Embed.find();
                embeds.length !== 0 ? await button_pages(interaction, Array.from({ length: Math.ceil(embeds.length / 5) }, (_, i) => embeds.slice(i * 5, i * 5 + 5).map(e => e.name).join('\n> ・'))) : await interaction.reply({ embeds: [embed.setDescription('No embeds found')] });
                break;
            }
            case 'delete': {
                const deleteEmbed = await Embed.findOne({ name: interaction.options.getString('name') });
                deleteEmbed ? (await deleteEmbed.deleteOne(), await interaction.reply({ embeds: [embed.setDescription(`Sucessfully deleted embed \`${interaction.options.getString('name')}\``)] })) : await interaction.reply({ embeds: [embed.setDescription(`Embed \`${interaction.options.getString('name')}\` not found`)] });
                break;
            }
            case 'send': {
                const customEmbed = new EmbedBuilder()
                    .setColor(process.env.COLOUR);
                switch (interaction.options.getString('name')) {
                case 'info': {
                    const infoSelect = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('info_select')
                                .setPlaceholder('Select an info embed to view')
                                .addOptions(
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('About us')
                                        .setValue('info_about_us')
                                        .setDescription('basic information about the server')
                                        .setEmoji('ℹ️'),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('Strike system')
                                        .setValue('info_strike_system')
                                        .setDescription('information on how the strike system works')
                                        .setEmoji('❌'),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('Server rewards')
                                        .setValue('info_server_rewards')
                                        .setDescription('information about server rewards')
                                        .setEmoji('🏆'),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('Server map')
                                        .setValue('info_server_map')
                                        .setDescription('a map of the server')
                                        .setEmoji('🗺️'),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('Partners and affiliates')
                                        .setValue('info_p&a')
                                        .setDescription('information about our partners and affiliates')
                                        .setEmoji('🤝'),
                                ),
                        );
                    return await interaction.deferReply({ ephemeral: true }).then(await interaction.deleteReply().catch(() => { return; }), await interaction.channel.send({ embeds: [customEmbed.setDescription(`⸝⸝ ★ __***\`INFO\`***__ ***!*** . . .\n
        ✰ \`O1\` — **__find out more__ *!***
        > click the drop down menu below to select a topic to view information on`)], components: [infoSelect] }));
                }
                case 'verification': {
                    const verification_button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('verification1')
                                .setLabel('Begin verification')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('✅'),
                        );
                    return await interaction.deferReply({ ephemeral: true }).then(await interaction.deleteReply().catch(() => { return; }), await interaction.channel.send({ embeds: [customEmbed.setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
        ✰ \`O1\` — **__get verified__ *!***
        > click the button below to begin verification! our guided verification process consists of selecting roles, reading server information, and answering questions in a ticket.`)], components: [verification_button] }));
                }
                case 'tickets': {
                    return await interaction.deferReply({ ephemeral: true })
                        .then(await interaction.deleteReply().catch(() => { return; }),
                            await interaction.channel.send({
                                embeds: [
                                    customEmbed.setDescription(`⸝⸝ ★ __***\`TICKETS\`***__ ***!*** . . .\n
        ✰ \`O1\` — **__do you have an issue__ *?***
        > click the button representing the category your issue fits in to open a ticket`)
                                        .setThumbnail('https://th.bing.com/th/id/R.55b2b783c01b21a5f0b9c8bea8041723?rik=sIPz2agCmNLraQ&pid=ImgRaw&r=0'),
                                ],
                                components: [
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId('tickets_support')
                                                .setLabel('support')
                                                .setStyle(ButtonStyle.Secondary)
                                                .setEmoji('🛠️'),
                                            new ButtonBuilder()
                                                .setCustomId('tickets_connections')
                                                .setLabel('connections')
                                                .setStyle(ButtonStyle.Secondary)
                                                .setEmoji('🔗'),
                                            new ButtonBuilder()
                                                .setCustomId('tickets_report')
                                                .setLabel('report')
                                                .setStyle(ButtonStyle.Secondary)
                                                .setEmoji('🚨'),
                                            new ButtonBuilder()
                                                .setCustomId('tickets_appeal')
                                                .setLabel('appeal')
                                                .setStyle(ButtonStyle.Secondary)
                                                .setEmoji('📝'),
                                        ),
                                ],
                            }));
                }
                case 'rr': {
                    await interaction.deferReply({ ephemeral: true })
                        .then(await interaction.deleteReply().catch(() => { return; }));
                    await interaction.channel.send({
                        embeds: [
                            customEmbed.setDescription(`⸝⸝ ★ __***\`SELF-ASSIGNABLE ROLES\`***__ ***!*** . . .\n
        ✰ \`O1\` — **__select a role__ *!***
        > select a role form the dropdown menu below to assign it to yourself`),
                        ],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId('rr_select_prns')
                                        .setPlaceholder('select pronouns roles')
                                        .setMinValues(1)
                                        .setMaxValues(6)
                                        .addOptions(
                                            {
                                                label: 'she/her',
                                                value: 'she/her',
                                                emoji: '♀️',
                                            },
                                            {
                                                label: 'he/him',
                                                value: 'he/him',
                                                emoji: '♂️',
                                            },
                                            {
                                                label: 'they/them',
                                                value: 'they/them',
                                                emoji: '👥',
                                            },
                                            {
                                                label: 'neopronouns',
                                                value: 'neopronouns',
                                                emoji: '🌈',
                                            },
                                            {
                                                label: 'name only',
                                                value: 'name only',
                                                emoji: '🆔',
                                            },
                                            {
                                                label: 'ask',
                                                value: 'ask',
                                                emoji: '❓',
                                            },
                                        ),
                                ),
                        ],
                    });
                    await interaction.channel.send({
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId('rr_select_pings')
                                        .setPlaceholder('select pings role')
                                        .addOptions(
                                            {
                                                label: 'okay to ping',
                                                value: 'otp',
                                                emoji: '✅',
                                            },
                                            {
                                                label: 'important pings only',
                                                value: 'ipo',
                                                emoji: '‼️',
                                            },
                                            {
                                                label: 'don\'t ping',
                                                value: 'dp',
                                                emoji: '❌',
                                            },
                                        ),
                                ),
                        ],
                    });
                    return await interaction.channel.send({
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId('rr_select_dms')
                                        .setPlaceholder('select dms role')
                                        .addOptions(
                                            {
                                                label: 'okay to dm',
                                                value: 'otd',
                                                emoji: '✅',
                                            },
                                            {
                                                label: 'ask to dm',
                                                value: 'atd',
                                                emoji: '‼️',
                                            },
                                            {
                                                label: 'don\'t dm',
                                                value: 'ddm',
                                                emoji: '❌',
                                            },
                                        ),
                                ),
                        ],
                    });
                }
                }
                const viewEmbed = await Embed.findOne({ name: interaction.options.getString('name') });
                if (!viewEmbed) return await interaction.reply({ embeds: [embed.setDescription(`Embed \`${interaction.options.getString('name')}\` not found`)] });
                const sendViewEmbed = new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(viewEmbed.content);
                viewEmbed.thumbnail ? sendViewEmbed.setThumbnail(viewEmbed.thumbnail) : 0;
                viewEmbed.image ? sendViewEmbed.setImage(viewEmbed.image) : 0;
                await interaction.deferReply({ ephemeral: true }).then(await interaction.deleteReply().catch(() => { return; }), await interaction.channel.send({ embeds: [sendViewEmbed] }));
                break;
            }
            case 'edit': {
                const editEmbed = await Embed.findOne({ name: interaction.options.getString('name') });
                editEmbed.thumbnail ? embed.setThumbnail(editEmbed.thumbnail) : 0;
                editEmbed.image ? embed.setImage(editEmbed.image) : 0;
                if (!editEmbed) return await interaction.reply({ embeds: [embed.setDescription(`Embed \`${interaction.options.getString('name')}\` not found`)] });
                await interaction.reply({
                    embeds: [embed.setDescription(editEmbed.content)],
                    components: [select, buttons],
                });
                const filter = i => i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter });
                collector.on('collect', async i => {
                    if (i.isStringSelectMenu()) {
                        await select_callback(interaction, i);
                    }
                    else if (i.isButton()) {
                        await collector.stop();
                        return await button_callback(interaction, i, editEmbed);
                    }
                });
            }
            }
            break;
        }
        case 'stats': {
            switch (interaction.options.getSubcommand()) {
            case 'tickets': {
                let stats = await StatsTickets.findOne();
                if (!stats) {
                    await StatsTickets.create({
                        _id: new mongoose.Types.ObjectId(),
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
                    stats = await StatsTickets.findOne();
                }
                const categories = [
                    { name: 'support', value: stats.nSupport },
                    { name: 'connections', value: stats.nConnections },
                    { name: 'report', value: stats.nReport },
                    { name: 'appeal', value: stats.nAppeal },
                    { name: 'verify', value: stats.nVerify },
                ];
                categories.sort((a, b) => b.value - a.value);
                const total = categories.reduce((acc, category) => acc + category.value, 0);

                const ratings = [
                    { name: 'very good', value: stats.veryGood, fullEmoji: '<:sc_teal_full:1102042385241866271>', halfEmoji: '<:sc_teal_half:1102042363372769371>' },
                    { name: 'good', value: stats.good, fullEmoji: '<:sc_green_full:1102042336889929778>', halfEmoji: '<:sc_green_half:1102042314010021898>' },
                    { name: 'neutral', value: stats.neutral, fullEmoji: '<:sc_yellow_full:1102042285312573582>', halfEmoji: '<:sc_yellow_half:1102042251196108870>' },
                    { name: 'bad', value: stats.bad, fullEmoji: '<:sc_orange_full:1103045327164031036>', halfEmoji: '<:sc_orange_half:1102041904142635119>' },
                    { name: 'very bad', value: stats.veryBad, fullEmoji: '<:sc_red_full:1102041866704261161>', halfEmoji: '<:sc_red_half:1102039031325401118>' },
                ];
                const totalReviews = ratings.reduce((acc, rating) => acc + rating.value, 0);
                const emptyEmoji = '<:sc_empty:1102038936576065596>';
                const graphs = [];
                for (let i = 0; i < ratings.length; i++) {
                    const rating = ratings[i];
                    const percentage = isNaN((rating.value / totalReviews) * 100) ? 0 : /\.([1-9])/.exec((rating.value / totalReviews) * 100) ? /\.([1-9])/.exec(((rating.value / totalReviews) * 100).toFixed(1)) ? ((rating.value / totalReviews) * 100).toFixed(1) : Math.floor(((rating.value / totalReviews) * 100).toFixed(1)) : Math.floor((rating.value / totalReviews) * 100);
                    const full = Math.floor(percentage / 10);
                    const half = Math.floor((percentage % 10) / 5);
                    const empty = 10 - full - half;
                    graphs.push(`・**${rating.name} —** \`${rating.value.toLocaleString()}\`\n> ${rating.fullEmoji.repeat(full)}${rating.halfEmoji.repeat(half)}${emptyEmoji.repeat(empty)} **${percentage.toLocaleString()}%**`);
                }

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOUR)
                            .setDescription(`⸝⸝ ★ __***\`${interaction.options.getSubcommand().toUpperCase()} STATISTICS\`***__ ***!*** . . .\n
✰ \`O1\` — **__number of tickets by category__ *!***
> ${categories.map((category) => { const percentage = isNaN((category.value / total) * 100) ? 0 : /\.([1-9])/.exec((category.value / total) * 100) ? /\.([1-9])/.exec(((category.value / total) * 100).toFixed(1)) ? ((category.value / total) * 100).toFixed(1) : Math.floor(((category.value / total) * 100).toFixed(1)) : Math.floor((category.value / total) * 100); return `・**${category.name}:** \`${category.value.toLocaleString()}\` **(${percentage.toLocaleString()}%)**`; }).join('\n> ')}
> ・**total:** \`${total.toLocaleString()}\`

✰ \`O2\` — **__rating__ *!***
> ・**total reviews:** \`${totalReviews.toLocaleString()}\`
> ${graphs.join('\n> ')}`),
                    ],
                });
            }
            }
            break;
        }
        case null: {
            switch (interaction.getSubcommand()) {
            case 'clear': {
                const amount = interaction.options.getInteger('amount');
                interaction.channel.bulkDelete(amount)
                    .then(messages => {
                        const chance = Math.floor(Math.random() * 100);
                        const ok = [
                            'ok',
                            'okay',
                            'okie dokie',
                            'alright',
                            'alrighty',
                            'mkay',
                            'mission success',
                        ];
                        const nomsg = [
                            'there\'s no msgs for me to delete lol',
                            'what do you want me to delete?',
                            'there\'s nothing here',
                            'there aren\'t any messages in this channel',
                            'i\'ve deleted 0 messages! feel productive yet? /lh',
                            'i don\'t know what you want me to delete',
                            'my condolences, you must be blind /lh',
                        ];
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(messages.size !== 0 ? `#${process.env.COLOUR}` : `#${process.env.WARNING_COLOUR}`)
                                    .setDescription(messages.size !== 0 ? (chance > 5 ? `${ok[Math.floor(Math.random() * ok.length)]}, ${messages.size} ${messages.size > 1 ? 'messages have' : 'message has'} been deleted!` : 'k.') : nomsg[Math.floor(Math.random() * nomsg.length)]),
                            ],
                        }).catch(() => { return; });
                        setTimeout(async () => { await interaction.deleteReply().catch(() => { return; }); }, 2000);
                    })
                    .catch(error => console.log(error));
            }
            }
            break;
        }
        case 'tickets': {
            switch (interaction.options.getSubcommand()) {
            case 'panel': {
                const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
                if (!ticket) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.WARNING_COLOUR)
                                .setDescription('you cannot access the staff panel for tickets in this channel'),
                        ],
                        ephemeral: true,
                    });
                }
                const pages = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_pin')
                                .setLabel(ticket.pinned ? 'unpin' : 'pin')
                                .setStyle(ticket.pinned ? ButtonStyle.Success : ButtonStyle.Secondary)
                                .setEmoji('📌'),
                            new ButtonBuilder()
                                .setCustomId('tickets_save')
                                .setLabel(ticket.saved ? 'open' : 'save')
                                .setStyle(ticket.saved ? ButtonStyle.Success : ButtonStyle.Primary)
                                .setEmoji(ticket.saved ? '🔓' : '💾'),
                            new ButtonBuilder()
                                .setCustomId('tickets_close')
                                .setLabel('close')
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji('🔒')
                                .setDisabled((ticket.saved !== undefined && ticket.saved == true) || (ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id)),
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_claim')
                                .setLabel(`${ticket.claimedBy == interaction.user.id ? 'unclaim' : 'claim'}`)
                                .setDisabled(ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id)
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('🙋'),
                            new ButtonBuilder()
                                .setCustomId('tickets_userInfo')
                                .setLabel('whois')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('🪪'),
                            new ButtonBuilder()
                                .setCustomId('tickets_notes')
                                .setLabel('notes')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('📝'),
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_users')
                                .setLabel('users')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('👥'),
                        ),
                ];
                if (ticket.category == 'verify' && !interaction.guild.members.cache.find(m => m.id == ticket.author).roles.cache.has('1094017909879230545')) {
                    pages[0] = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_pin')
                                .setLabel(ticket.pinned ? 'unpin' : 'pin')
                                .setStyle(ticket.pinned ? ButtonStyle.Success : ButtonStyle.Secondary)
                                .setEmoji('📌'),
                            new ButtonBuilder()
                                .setCustomId('tickets_save')
                                .setLabel(ticket.saved ? 'open' : 'save')
                                .setStyle(ticket.saved ? ButtonStyle.Success : ButtonStyle.Primary)
                                .setEmoji(ticket.saved ? '🔓' : '💾'),
                            new ButtonBuilder()
                                .setCustomId('tickets_verifyUser')
                                .setLabel('verify')
                                .setStyle(ButtonStyle.Success)
                                .setEmoji('✅')
                                .setDisabled(ticket.saved !== undefined && ticket.saved == true),
                        );
                    pages[1] = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('tickets_close')
                                .setLabel('close')
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji('🔒')
                                .setDisabled(ticket.saved !== undefined && ticket.saved == true),
                            new ButtonBuilder()
                                .setCustomId('tickets_claim')
                                .setLabel(`${ticket.claimedBy == interaction.user.id ? 'unclaim' : 'claim'}`)
                                .setDisabled(ticket.claimedBy !== undefined && ticket.claimedBy !== interaction.user.id)
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('🙋'),
                            new ButtonBuilder()
                                .setCustomId('tickets_userInfo')
                                .setLabel('whois')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('🪪'),
                        );
                    pages[2] = new ActionRowBuilder()
                        .addComponents(
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
                                new StringSelectMenuOptionBuilder()
                                    .setLabel('page 3')
                                    .setValue('3')
                                    .setDefault(interaction.values && interaction.values[0] == '3' ? true : false),
                            ),
                    );
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
                await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && ['tickets_save', 'tickets_close', 'tickets_claim', 'tickets_pin', 'tickets_userInfo', 'tickets_staffPanel', 'tickets_staffPanel_select', 'tickets_notes', 'tickets_users', 'tickets_verifyUser'].includes(i.customId), time: 60000 })
                    .then(async () => {
                        await interaction.deleteReply().catch(() => { return; });
                    })
                    .catch(async () => {
                        await interaction.deleteReply().catch(() => { return; });
                    });
            }
            }
        }
        }
    },
};