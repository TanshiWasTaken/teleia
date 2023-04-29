const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'verification1-2' || !interaction.isButton()) return;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
✰ \`O4\` — **__are you or do you support any of these people__ *?***
> there's a few more things to go over, but you're almost done!`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('verification2')
                            .setLabel('no, continue')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('➡️'),
                    ),
            ],
            ephemeral: true,
        });
    },
};