const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ComponentType } = require('discord.js');
const step1_2 = require('./step1_2');

const pronouns_roles = ['1094025640992325654', '1094025628732362783', '1094025652262424636', '1094025675389816852', '1096913307908186142', '1094025686114644118'];
const age_roles = ['1094025696701071441', '1094025714350690328', '1094025725037772831'];
const ping_roles = ['1094025735422873680', '1094025745778614324', '1094025757254221994'];
const dm_roles = ['1094025769442869378', '1094025780285161483', '1094047480892629002'];

async function main(interaction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.COLOUR)
                .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
✰ \`O1\` — **__age__ *!***
> how old are you?`),
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('age')
                        .setPlaceholder('Select an age role')
                        .addOptions(
                            {
                                label: '13-15',
                                value: '13-15',
                                emoji: '🍼',
                            },
                            {
                                label: '16-17',
                                value: '16-17',
                                emoji: '🍭',
                            },
                            {
                                label: '18+',
                                value: '18+',
                                emoji: '🔞',
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
    ✰ \`O1\` — **__age__ *!***
    > how old are you?`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('age')
                            .setPlaceholder('Select an age role')
                            .addOptions(
                                {
                                    label: '13-15',
                                    value: '13-15',
                                    emoji: '🍼',
                                },
                                {
                                    label: '16-17',
                                    value: '16-17',
                                    emoji: '🍭',
                                },
                                {
                                    label: '18+',
                                    value: '18+',
                                    emoji: '🔞',
                                },
                            ),
                    ),
            ],
            ephemeral: true,
        });
    });
    await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId === 'age', componentType: ComponentType.StringSelect, time: 60000 })
        .then(async () => {
            await interaction.deleteReply().catch(() => { return; });
        })
        .catch(async () => {
            await interaction.deleteReply().catch(() => { return; });
        });
}

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId == 'retry_verification1') {
            for (let i = 0; i < pronouns_roles.length; i++) {
                if (interaction.member.roles.cache.has(pronouns_roles[i])) {
                    await interaction.member.roles.remove(pronouns_roles[i]);
                }
            }
            for (let i = 0; i < age_roles.length; i++) {
                if (interaction.member.roles.cache.has(age_roles[i])) {
                    await interaction.member.roles.remove(age_roles[i]);
                }
            }
            for (let i = 0; i < ping_roles.length; i++) {
                if (interaction.member.roles.cache.has(ping_roles[i])) {
                    await interaction.member.roles.remove(ping_roles[i]);
                }
            }
            for (let i = 0; i < dm_roles.length; i++) {
                if (interaction.member.roles.cache.has(dm_roles[i])) {
                    await interaction.member.roles.remove(dm_roles[i]);
                }
            }
            return await main(interaction);
        }
        if (interaction.customId !== 'verification1' || !interaction.isButton()) return;
        if (await interaction.member.roles.cache.some(role => age_roles.includes(role.id))) {
            return step1_2.execute(interaction);
        }
        else if (!await interaction.member.roles.cache.some(role => age_roles.includes(role.id))) {
            await main(interaction);
        }
    },
};