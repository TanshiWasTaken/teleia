const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'verification2') return;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`RULES\`***__ ***!*** . . .\n
✰ \`O1\` — **__respect__**:
> you are expected to be respectful within the confines of this server. you will be removed from this space if you are repeatedly disrespectful to others.
✰ \`O2\` — **__inclusivity__**:
> this is an inclusive space. please be open-minded and willing to learn about identities, cultures, practices, beliefs, and needs that differ from your own.
✰ \`O3\` — **__maturity__**:
> this server is intended for a more mature sfw audience. be mature when confronted by others or when discussing serious topics.
✰ \`O4\` — **__server use__**:
> please use server assets as intended—read server and channel info, do not spam, do not use pluralkit, tupperbox, or proxyfox if you are not a system, etc.
✰ \`O5\` — **__have fun__**:
> enjoy your time here! these rules are short because we want you to focus on making friends and having a good time, instead of having to memorize a lot of rules.`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('verification2_2')
                            .setLabel('i agree')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('➡️'),
                    ),
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'verification2_2', componentType: ComponentType.Button, time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};