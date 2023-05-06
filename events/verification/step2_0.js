const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'verification1-2' || !interaction.isButton()) return;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`VERIFY - DNI LIST\`***__ ***!*** . . .\n
✰ \`O4\` — **__are you or do you support any of these people__ *?***
> ・those who discriminate against, mock, judge, or objectify others based on attributes of their character.¹
> ・those who romanticize or glorify things that should not be romanticized or glorified.²
> ・those who fetishize or sexualize things that should not be fetishized or sexualized.³
> ・those who display behavior that is anti-recovery or anti-self-diagnosis in nature.
> ・those who are endogenic systems.
> ・delusional attachments/irls.
> ・those who support or are neutral towards the above.

¹color, ethnicity, religion, sexuality, gender identity, etc.
²stalking, pedophilia, zoophilia, incest, illnesses, disorders, self-harm, suicide, etc.
³lgbtq+ individuals, minors, animals, as well as the above. 
`),
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
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId == 'verification2', componentType: ComponentType.Button, time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};