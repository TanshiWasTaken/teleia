const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');
const pronouns_roles = ['1094025640992325654', '1094025628732362783', '1094025652262424636'];
const age_roles = ['1094025696701071441', '1094025714350690328', '1094025725037772831'];
const ping_roles = ['1094025735422873680', '1094025745778614324', '1094025757254221994'];
const dm_roles = ['1094025769442869378', '1094025780285161483', '1094047480892629002'];
const step2_0 = require('./step2_0');

async function main(interaction) {
    const prns_r = [];
    for (let i = 0; i < pronouns_roles.length; i++) {
        if (await interaction.member.roles.cache.find(r => r.id == pronouns_roles[i])) {
            prns_r.push(pronouns_roles[i]);
        }
    }
    const age_r = await interaction.member.roles.cache.find(r => r.id == age_roles[0]) ? age_roles[0] : await interaction.member.roles.cache.find(r => r.id == age_roles[1]) ? age_roles[1] : age_roles[2];
    const ping_r = await interaction.member.roles.cache.find(r => r.id == ping_roles[0]) ? ping_roles[0] : await interaction.member.roles.cache.find(r => r.id == ping_roles[1]) ? ping_roles[1] : ping_roles[2];
    const dm_r = await interaction.member.roles.cache.find(r => r.id == dm_roles[0]) ? dm_roles[0] : await interaction.member.roles.cache.find(r => r.id == dm_roles[1]) ? dm_roles[1] : dm_roles[2];
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.COLOUR)
                .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
✰ \`O4\` — **__are these roles correct__ *?***
> pronouns: ${prns_r.length == 1 ? `<@&${prns_r[0]}>` : prns_r.map(r => `<@&${r}>`).join(', ')}
> age: <@&${age_r}>
> ping: <@&${ping_r}>
> dm: <@&${dm_r}>`),
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('retry_verification1')
                        .setLabel('no, retry')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔁'),
                    new ButtonBuilder()
                        .setCustomId('verification1-2')
                        .setLabel('yes, continue')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('➡️'),
                ),
        ],
        ephemeral: true,
    });
    await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && (i.customId == 'retry_verification1' || i.customId == 'verification2'), componentType: ComponentType.Button })
        .then(async (collected) => {
            await interaction.deleteReply().catch(() => { return; });
            if (collected.customId !== 'verification1-2') {
                await collected.deferReply({ ephemeral: true });
                return interaction.client.emit('interactionCreate', collected);
            }
        });
}

module.exports = {
    name: 'Step 1.5',
    once: false,
    async execute(interaction) {
        if (interaction.customId == 'verification1') {
            interaction.customId = 'verification1-2';
            return await step2_0.execute(interaction);
        }
        if (interaction.customId !== 'dms' || !interaction.isStringSelectMenu()) return;
        await interaction.member.roles.add(`${interaction.values[0] == 'otd' ? '1094025769442869378' : interaction.values[0] == 'atd' ? '1094025780285161483' : '1094047480892629002'}`);
        await main(interaction);

        // code the next step of the verification system with buttons
        // the next steps are prohibited individuals and rules with a final confirm embed
    },
};