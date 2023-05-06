const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.customId?.startsWith('rr_select_')) return;
        switch (interaction.customId) {
        case 'rr_select_prns': {
            const pronouns_roles = ['1094025640992325654', '1094025628732362783', '1094025652262424636', '1094025675389816852', '1096913307908186142', '1094025686114644118'];
            await interaction.member.roles.remove(pronouns_roles);
            for (let i = 0; i < interaction.values.length; i++) {
                await interaction.member.roles.add(`${interaction.values[i] == 'she/her' ? '1094025640992325654' : interaction.values[i] == 'he/him' ? '1094025628732362783' : interaction.values[i] == 'they/them' ? '1094025652262424636' : interaction.values[i] == 'neopronouns' ? '1094025675389816852' : interaction.values[i] == 'name only' ? '1096913307908186142' : '1094025686114644118'}`);
            }
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('your pronouns roles have been updated!'),
                ],
                ephemeral: true,
            });
        }
        case 'rr_select_pings': {
            const ping_roles = ['1094025735422873680', '1094025745778614324', '1094025757254221994'];
            await interaction.member.roles.remove(ping_roles);
            await interaction.member.roles.add(`${interaction.values[0] == 'otp' ? '1094025735422873680' : interaction.values[0] == 'ipo' ? '1094025745778614324' : '1094025757254221994'}`);
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('your ping roles have been updated!'),
                ],
                ephemeral: true,
            });
        }
        case 'rr_select_dms': {
            const dms_roles = ['1094025769442869378', '1094025780285161483', '1094047480892629002'];
            await interaction.member.roles.remove(dms_roles);
            await interaction.member.roles.add(`${interaction.values[0] == 'otd' ? '1094025769442869378' : interaction.values[0] == 'atd' ? '1094025780285161483' : '1094047480892629002'}`);
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription('your dms roles have been updated!'),
                ],
                ephemeral: true,
            });
        }
        }
    },
};