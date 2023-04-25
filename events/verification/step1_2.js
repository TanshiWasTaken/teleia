const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ComponentType } = require('discord.js');
const step1_3 = require('./step1_3');

async function main(interaction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.COLOUR)
                .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
✰ \`O2\` — **__pronouns__ *!***
> how should we refer to you?`)],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('pronouns')
                        .setPlaceholder('Select a pronoun role')
                        .setMinValues(1)
                        .setMaxValues(3)
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
                        ),
                ),
        ],
        ephemeral: true,
    }).catch(async () => {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
    ✰ \`O2\` — **__pronouns__ *!***
    > how should we refer to you?`)],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('pronouns')
                            .setPlaceholder('Select a pronoun role')
                            .setMinValues(1)
                            .setMaxValues(3)
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
                            ),
                    ),
            ],
            ephemeral: true,
        });
    });
    await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId === 'pronouns', componentType: ComponentType.StringSelect })
        .then(async () => {
            await interaction.deleteReply().catch(() => { return; });
            // return step1_3.execute(interaction);
        });
}

module.exports = {
    name: 'Verification Step 1.2',
    once: false,
    async execute(interaction) {
        if (interaction.customId == 'verification1') {
            const pronouns_roles = ['1094025640992325654', '1094025628732362783', '1094025652262424636'];
            if (await interaction.member.roles.cache.some(role => pronouns_roles.includes(role.id))) {
                return step1_3.execute(interaction);
            }
            else if (!await interaction.member.roles.cache.some(role => pronouns_roles.includes(role.id))) {
                return await main(interaction);
            }
        }
        if (interaction.customId !== 'age' || !interaction.isStringSelectMenu()) { return; }
        await interaction.member.roles.add(`${interaction.values[0] == '13-15' ? '1094025696701071441' : interaction.values[0] == '16-17' ? '1094025714350690328' : '1094025725037772831'}`);
        await main(interaction);
    },
};