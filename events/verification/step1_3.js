const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ComponentType } = require('discord.js');
const step1_4 = require('./step1_4');

async function main(interaction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.COLOUR)
                .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
✰ \`O3\` — **__pings__ *!***
> is it okay to ping you?`)],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('pings')
                        .setPlaceholder('Select a ping role')
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
        ephemeral: true,
    }).catch(async (err) => {
        console.log(err);
        /* await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
    ✰ \`O3\` — **__pings__ *!***
    > is it okay to ping you?`)],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('pings')
                            .setPlaceholder('Select a ping role')
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
            ephemeral: true,
        }); */
    });
    await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId === 'pings', componentType: ComponentType.StringSelect })
        .then(async () => {
            await interaction.deleteReply().catch(() => { return; });
            // return step1_4.execute(interaction);
        });
}

module.exports = {
    name: 'Step 1.3',
    once: false,
    async execute(interaction) {
        if (interaction.customId == 'verification1') {
            const ping_roles = ['1094025735422873680', '1094025745778614324', '1094025757254221994'];
            if (await interaction.member.roles.cache.some(role => ping_roles.includes(role.id))) {
                return step1_4.execute(interaction);
            }
            else if (!await interaction.member.roles.cache.some(role => ping_roles.includes(role.id))) {
                return await main(interaction);
            }
        }
        if (interaction.customId !== 'pronouns' || !interaction.isStringSelectMenu()) { return; }
        for (let i = 0; i < interaction.values.length; i++) {
            await interaction.member.roles.add(`${interaction.values[i] == 'she/her' ? '1094025640992325654' : interaction.values[i] == 'he/him' ? '1094025628732362783' : '1094025652262424636'}`);
        }
        await main(interaction);
    },
};