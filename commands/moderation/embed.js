const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('manipulates embeds')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('creates an embed')
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
            const embed = new EmbedBuilder()
                .setColor(process.env.COLOUR);
            interaction.options.getString('content') ? embed.setDescription(interaction.options.getString('content')) : 0;
            interaction.options.getAttachment('thumbnail')?.attachment ? embed.setThumbnail(interaction.options.getAttachment('thumbnail')?.attachment) : 0;
            interaction.options.getAttachment('image')?.attachment ? embed.setThumbnail(interaction.options.getAttachment('image')?.attachment) : 0;
            if (!interaction.options.getString('content')) {
                const promptEmbed = new EmbedBuilder()
                    .setColor(process.env.COLOUR);
                await interaction.reply({
                    embeds: [
                        promptEmbed.setDescription('send what you want the `content` to be'),
                    ],
                });
                const filter = m => m.author.id === interaction.user.id;
                await interaction.channel.awaitMessages({ filter, max: 1 })
                    .then(async (collected) => {
                        await collected.first().delete();
                        await interaction.editReply({
                            embeds: [
                                embed.setDescription(collected.first().content),
                                promptEmbed.setDescription('send what you want the `thumbnail` to be'),
                            ],
                        });
                    });
                await interaction.channel.awaitMessages({ filter, max: 1 })
                    .then(async (collected) => {
                        await collected.first().delete();
                        await interaction.editReply({
                            embeds: [
                                embed.setThumbnail(collected.first().content),
                                promptEmbed.setDescription('send what you want the `image` to be'),
                            ],
                        });
                    });
                await interaction.channel.awaitMessages({ filter, max: 1 })
                    .then(async (collected) => {
                        await collected.first().delete();
                        embed.setImage(collected.first().content);
                    });
            }
            return await interaction.editReply({
                embeds: [embed],
            });
        }
        }
    },
};