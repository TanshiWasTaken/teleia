const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Embed = require('../../schemas/embed');
const embed = new EmbedBuilder()
    .setColor(process.env.COLOUR);
async function description(interaction) {
    const edit_description = new ModalBuilder()
        .setCustomId('edit_description')
        .setTitle('Edit Description')
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('Description')
                        .setPlaceholder('Content of the embed')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true),
                ),
        );
    await interaction.showModal(edit_description);
    await interaction.client.on('interactionCreate', async i => {
        if (!i.isModalSubmit()) return;
        switch (i.customId) {
        case 'edit_description': {
            embed.setDescription(i.fields.getTextInputValue('description'));
        }
        }
    });
    await interaction.awaitModalSubmit({ filter: i => i.customId === 'edit_description' && i.user.id === interaction.user.id, time: 2_147_483_647 })
        .then(async i => {
            i.reply({
                content: 'Description updated',
                ephemeral: true,
            });
            embed.setDescription(await i.fields.getTextInputValue('description'));
        });
}
async function image(interaction) {
    const edit_image = new ModalBuilder()
        .setCustomId('edit_image')
        .setTitle('Edit Image')
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('image')
                        .setLabel('Image')
                        .setPlaceholder('URL of the image')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false),
                ),
        );
    await interaction.showModal(edit_image);
    await interaction.client.on('interactionCreate', async i => {
        if (!i.isModalSubmit()) return;
        switch (i.customId) {
        case 'edit_image': {
            embed.setDescription(i.fields.getTextInputValue('image'));
        }
        }
    });
}
async function thumbnail(interaction) {
    const edit_thumbnail = new ModalBuilder()
        .setCustomId('edit_thumbnail')
        .setTitle('Edit Thumbnail')
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('thumbnail')
                        .setLabel('Thumbnail')
                        .setPlaceholder('URL of the thumbnail')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false),
                ),
        );
    await interaction.showModal(edit_thumbnail);
    await interaction.client.on('interactionCreate', async i => {
        if (!i.isModalSubmit()) return;
        switch (i.customId) {
        case 'edit_thumbnail': {
            embed.setDescription(i.fields.getTextInputValue('thumbnail'));
        }
        }
    });
}
async function update_embed(interaction) {
    return await interaction.editReply({
        embeds: [embed],
    });
}
async function edit_select_callback(interaction, i) {
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
}
async function button_callback(interaction, i, collector) {
    switch (i.customId) {
    case 'cancel': {
        await interaction.deleteReply();
        break;
    }
    case 'finish': {
        await interaction.editReply({
            components: [],
        });
        const newEmbed = new Embed({
            _id: new mongoose.Types.ObjectId(),
            content: embed.data.description,
            thumbnail: embed.data?.thumbnail,
            image: embed.data?.image,
        });
        await newEmbed.save();
        break;
    }
    }
    return await collector.stop();
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
                    .setDescription('Edit the content of the embed'),
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
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
        case 'create': {
            interaction.options.getString('content') ? embed.setDescription(interaction.options.getString('content')) : 0;
            interaction.options.getAttachment('thumbnail')?.attachment ? embed.setThumbnail(interaction.options.getAttachment('thumbnail')?.attachment) : 0;
            interaction.options.getAttachment('image')?.attachment ? embed.setThumbnail(interaction.options.getAttachment('image')?.attachment) : 0;
            if (!interaction.options.getString('content')) {
                await interaction.reply({
                    embeds: [embed.setDescription('this is an embed')],
                    components: [select, buttons],
                });
                const filter = i => i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter });

                collector.on('collect', async i => {
                    if (i.isStringSelectMenu()) {
                        await edit_select_callback(interaction, i);
                    }
                    else if (i.isButton()) {
                        return await button_callback(interaction, i, collector);
                    }
                });
            }
        }
        }
    },
};