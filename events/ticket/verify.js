const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'tickets_verifyUser') return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        const membersRole = '1094017909879230545';
        const unverifiedRole = '1094017926090211490';
        const dividerRoles = ['1096645359146635264', '1096913494055587883', '1096650923108999220', '1096650924098850819'];
        const member = await interaction.guild.members.cache.find(m => m.id == ticket.author);
        if (!member) return;
        // give the member the membersRole, remove the unverifiedRole, give the member the dividerRoles and send an embed confirming the action
        await member.roles.add(membersRole);
        await member.roles.remove(unverifiedRole);
        await member.roles.add(dividerRoles);
        await interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`${interaction.user} has verified ${member}`),
            ],
        });
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`you have verified ${member}`),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tickets_staffPanel')
                            .setLabel('staff panel')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🛠️'),
                    ),
            ],
        });
        await interaction.channel.awaitMessageComponent({ filter: i => i.user.id == interaction.user.id && i.customId == 'tickets_staffPanel', componentType: ComponentType.Button, time: 60000 })
            .then(async () => {
                await interaction.deleteReply().catch(() => { return; });
            })
            .catch(async () => {
                await interaction.deleteReply().catch(() => { return; });
            });
    },
};