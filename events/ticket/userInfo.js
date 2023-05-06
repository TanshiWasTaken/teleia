const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'tickets_userInfo') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        const member = interaction.guild.members.cache.get(ticket.author);
        /* const keyperms = [];
        for (let i = 0; i < member.permissions.toArray().length; i++) {
            const perm = member.permissions.toArray()[i].replace(/([A-Z])/g, ' $1').trim();
            if (['Administrator', 'Ban Members', 'Kick Members', 'Manage Guild', 'Moderate Members', 'Manage Channels', 'Manage Emojis', 'Manage Messages', 'Manage Nicknames', 'Manage Roles', 'Manage Webhooks', 'Mention Everyone', 'View Audit Log', 'View Guild Insights'].includes(perm)) {
                keyperms.push(perm);
            }
        } */
        const acknowledgements = [];
        if (['1014968963781902436', '721555214167179314'].includes(member.id)) {
            acknowledgements.push('server owner');
        }
        for (let i = 0; i < member.roles.cache.size; i++) {
            switch (member.roles.cache.map(r => r.id)[i]) {
            case '1094017816941821994': {
                if (acknowledgements.includes('administrator')) break;
                acknowledgements.push('administrator');
                break;
            }
            case '1094017845781868564': {
                acknowledgements.push('moderator');
                break;
            }
            case '1097993345499934730': {
                acknowledgements.push('affiliate');
                break;
            }
            case '1097993121872220310': {
                acknowledgements.push('partner');
                break;
            }
            case '1094017862626201610': {
                acknowledgements.push('booster');
                break;
            }
            case '1094017875175555195': {
                acknowledgements.push('verified artist');
                break;
            }
            default: {
                if (member.permissions.has(PermissionsBitField.Flags.Administrator) && !acknowledgements.includes('administrator')) {
                    acknowledgements.push('administrator');
                }
            }
            }
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('tickets_userInfo_back')
                    .setLabel('back')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('◀️'),
                new ButtonBuilder()
                    .setCustomId('tickets_userInfo_avatarU')
                    .setLabel('user avatar')
                    .setStyle(ButtonStyle.Secondary),
            );
        await member.avatarURL({ dynamic: true, size: 4096 }) ? row.addComponents(
            new ButtonBuilder()
                .setCustomId('tickets_userInfo_avatarG')
                .setLabel('server avatar')
                .setStyle(ButtonStyle.Secondary),
        ) : 0;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setDescription(`⸝⸝ ★ __***\`${member.user.username.toLowerCase().endsWith('s') ? `${member.user.username.toUpperCase()}'` : `${member.user.username.toUpperCase()}'S`} INFO\`***__ ***!*** . . .\n
✰ \`O1\` — **__user info__ *!***
> ・**id:** \`${member.id}\` ${member}
> ・**registered:** \`${member.user.createdAt.toLocaleString()}\`

✰ \`O2\` — **__member info__ *!***
${member.nickname ? `> ・**nickname:** \`${member.nickname}\`\n` : ''}> ・**joined:** \`${member.joinedAt.toLocaleString()}\`
> ・**acknowledgements:** ${acknowledgements.length == 0 ? '`none`' : `\`\`\`${acknowledgements.join('\n> ')}\`\`\``}`),
                /* > ・**key permissions:** ${keyperms.length == 0 ? '`none`' : `\`\`\`${keyperms.join('\n> ')}\`\`\``}
✰ \`O3\` — **__roles__ *!***
> ${member.roles.cache.size == 0 ? '`none`' : member.roles.cache.map(r => r).filter(r => r !== interaction.guild.roles.everyone).join('\n> ')} */
            ],
            components: [
                row,
            ],
            ephemeral: true,
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id && ['tickets_userInfo_back', 'tickets_userInfo_avatarU', 'tickets_userInfo_avatarG'].includes(i.customId), time: 60000 })
            .then(async (i) => {
                if (i.customId == 'tickets_userInfo_back') {
                    i.customId = 'tickets_staffPanel_select';
                    i.values = ['2'];
                    i.client.emit('interactionCreate', i);
                }
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};