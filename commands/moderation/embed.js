const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');
const mongoose = require('mongoose');
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
        });
}
async function image(interaction) {
    await interaction.reply({ content: 'send an image or a link to one below. type `remove` to remove the image or type `cancel` to cancel the edit.', ephemeral: true });
    await interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 })
        .then(async collected => {
            if (collected.first().content.toLowerCase() == 'remove') { await collected.first().delete(); await interaction.deleteReply().catch(() => { return; }); return embed.setImage(); }
            else if (collected.first().content.toLowerCase() == 'cancel') { await collected.first().delete(); return await interaction.deleteReply().catch(() => { return; }); }
            const regex = /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?.(jpg|jpeg|gif|png)(\?(.*))?$/g.exec(collected.first().content);
            if (collected.first().attachments.first()?.url && collected.first().attachments.first()?.contentType.startsWith('image')) { embed.setImage(collected.first().attachments.first()?.url); }
            else if (regex) { embed.setImage(regex[0]); }
            else if (collected.first().attachments.first() && !collected.first().attachments.first().contentType.startsWith('image')) { await interaction.followUp({ content: 'videos, audios or anything else other than an image or gif cannot be used as an image.', ephemeral: true }); }
            else if (!collected.first().attachments.first()?.url && !regex) { await interaction.followUp({ content: 'no attachment or link was found', ephemeral: true }); }
            await collected.first().delete().catch(() => { return; });
            await interaction.deleteReply().catch(() => { return; });
        });
}
async function thumbnail(interaction) {
    await interaction.reply({ content: 'send an image or a link to one below. type `remove` to remove the thumbnail or type `cancel` to cancel the edit', ephemeral: true });
    await interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 })
        .then(async collected => {
            if (collected.first().content.toLowerCase() == 'remove') { await collected.first().delete(); await interaction.deleteReply().catch(() => { return; }); return embed.setThumbnail(); }
            else if (collected.first().content.toLowerCase() == 'cancel') { await collected.first().delete(); return await interaction.deleteReply().catch(() => { return; }); }
            const regex = /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?.(jpg|jpeg|gif|png)(\?(.*))?$/g.exec(collected.first().content);
            if (collected.first().attachments.first()?.url && collected.first().attachments.first()?.contentType.startsWith('image')) { embed.setThumbnail(collected.first().attachments.first()?.url); }
            else if (regex) { embed.setThumbnail(regex[0]); }
            else if (collected.first().attachments.first() && !collected.first().attachments.first().contentType.startsWith('image')) { await interaction.followUp({ content: 'videos, audios or anything else other than an image or gif cannot be used as a thumbnail.', ephemeral: true }); }
            else if (!collected.first().attachments.first()?.url && !regex) { await interaction.followUp({ content: 'no attachment or link was found', ephemeral: true }); }
            await collected.first().delete().catch(() => { return; });
            await interaction.deleteReply().catch(() => { return; });
        });
}
async function update_embed(interaction) {
    return await interaction.editReply({
        embeds: [embed],
    });
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
            });
            await newEmbed.save();
            embed.setThumbnail();
            embed.setImage();
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
            await editEmbed.save();
            embed.setThumbnail();
            embed.setImage();
            break;
        }
        }
    }
    }
}
async function button_pages(interaction, pages, time = 60000) {
    // await interaction.deferReply();
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
        });
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
        .setName('embed')
        .setDescription('manipulates embeds')
        .setDMPermission(true)
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
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
        case 'create': {
            if (await Embed.findOne({ name: interaction.options.getString('name') })) return await interaction.reply({ embeds: [embed.setDescription(`An embed with the name \`${interaction.options.getString('name')}\` already exists`)] });
            interaction.options.getAttachment('thumbnail')?.attachment ? embed.setThumbnail(interaction.options.getAttachment('thumbnail')?.attachment) : 0;
            interaction.options.getAttachment('image')?.attachment ? embed.setImage(interaction.options.getAttachment('image')?.attachment) : 0;
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
                            .setCustomId('infoEmbeds')
                            .setPlaceholder('Select an info embed to view')
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel('About us')
                                    .setValue('about_us')
                                    .setDescription('basic information about the server')
                                    .setEmoji('ℹ️'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel('Strike system')
                                    .setValue('strike_system')
                                    .setDescription('information on how the strike system works')
                                    .setEmoji('❌'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel('Server rewards')
                                    .setValue('server_rewards')
                                    .setDescription('information about server rewards')
                                    .setEmoji('🏆'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel('Server map')
                                    .setValue('server_map')
                                    .setDescription('a map of the server')
                                    .setEmoji('🗺️'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel('Partners and affiliates')
                                    .setValue('p&a')
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
    },
};