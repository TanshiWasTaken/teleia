const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ComponentType } = require('discord.js');
const step1_5 = require('./step1_5');

async function main(interaction) {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.COLOUR)
                .setDescription(`⸝⸝ ★ __***\`ROLES\`***__ ***!*** . . .\n
✰ \`O1\` — **__dms__ *!***
> is it okay to dm you?`)],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('dms')
                        .setPlaceholder('Select a dm role')
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
        ephemeral: true,
    });
    await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && i.customId === 'dms', componentType: ComponentType.StringSelect, time: 60000 })
        .then(async () => {
            await interaction.deleteReply().catch(() => { return; });
            // return step1_5.execute(interaction);
        })
        .catch(async () => {
            await interaction.deleteReply().catch(() => { return; });
        });
}

module.exports = {
    name: 'Step 1.4',
    once: false,
    async execute(interaction) {
        if (interaction.customId == 'verification1') {
            const dm_roles = ['1094025769442869378', '1094025780285161483', '1094047480892629002'];
            if (await interaction.member.roles.cache.some(role => dm_roles.includes(role.id))) {
                return step1_5.execute(interaction);
            }
            else if (!await interaction.member.roles.cache.some(role => dm_roles.includes(role.id))) {
                return await main(interaction);
            }
        }
        if (interaction.customId !== 'pings' || !interaction.isStringSelectMenu()) { return; }
        await interaction.member.roles.add(`${interaction.values[0] == 'otp' ? '1094025735422873680' : interaction.values[0] == 'ipo' ? '1094025745778614324' : '1094025757254221994'}`);
        await main(interaction);
    },
};