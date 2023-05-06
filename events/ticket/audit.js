const { EmbedBuilder } = require('discord.js');
const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!['tickets_notes_addModal', 'tickets_claim', 'tickets_pin', 'tickets_notes_remove_select', 'tickets_users_remove_select', 'tickets_save', 'tickets_verifyUser'].includes(interaction.customId)) return;
        const ticket = await Ticket.findOne({ channel: interaction.channel.id, open: true });
        if (!ticket) return;
        const audit = await interaction.guild.channels.cache.find(c => c.id === '1092602285286232095');
        switch (interaction.customId) {
        case 'tickets_notes_addModal': {
            return await audit.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`⸝⸝ ★ __***\`TICKET UPDATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a note was added__ *!***
> ・**ticket:** ${interaction.channel} (\`${ticket.id}\`)
> ・**note:** \`\`${interaction.components[0].components[0].value}\`\`
> ・**author:** ${interaction.user}`),
                ],
            });
        }
        case 'tickets_claim': {
            return await audit.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`⸝⸝ ★ __***\`TICKET UPDATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a ticket was ${ticket.claimedBy !== undefined ? 'un' : ''}claimed__ *!***
> ・**ticket:** ${interaction.channel} (\`${ticket.id}\`)
> ・**${ticket.claimedBy !== undefined ? 'un' : ''}claimed by:** ${interaction.user}`),
                ],
            });
        }
        case 'tickets_pin': {
            return await audit.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`⸝⸝ ★ __***\`TICKET UPDATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a ticket was ${ticket.pinned ? 'un' : ''}pinned__ *!***
> ・**ticket:** ${interaction.channel} (\`${ticket.id}\`)
> ・**${ticket.pinned ? 'un' : ''}pinned by:** ${interaction.user}`),
                ],
            });
        }
        case 'tickets_notes_remove_select': {
            return await audit.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`⸝⸝ ★ __***\`TICKET UPDATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a note was removed__ *!***
> ・**ticket:** ${interaction.channel} (\`${ticket.id}\`)
> ・**note:** \`\`${ticket.notes[interaction.values[0] - 1].text}\`\`
> ・**author:** ${interaction.guild.members.cache.find(m => m.id == ticket.notes[interaction.values[0] - 1].author)}
> ・**removed by:** ${interaction.user}`),
                ],
            });
        }
        case 'tickets_users_remove_select': {
            return await audit.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`⸝⸝ ★ __***\`TICKET UPDATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a user was removed__ *!***
> ・**ticket:** ${interaction.channel} (\`${ticket.id}\`)
> ・**user:** ${interaction.guild.members.cache.find(m => m.id == ticket.users[interaction.values[0]])}
> ・**removed by:** ${interaction.user}`),
                ],
            });
        }
        case 'tickets_save': {
            return await audit.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`⸝⸝ ★ __***\`TICKET UPDATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a ticket was ${ticket.saved ? 'reopened' : 'saved'}__ *!***
> ・**ticket:** ${interaction.channel} (\`${ticket.id}\`)
> ・**${ticket.saved ? 'reopened' : 'saved'} by:** ${interaction.user}`),
                ],
            });
        }
        case 'tickets_verifyUser': {
            return await audit.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`⸝⸝ ★ __***\`TICKET UPDATED\`***__ ***!*** . . .\n
✰ \`O1\` — **__a user was verified__ *!***
> ・**ticket:** ${interaction.channel} (\`${ticket.id}\`)
> ・**user:** ${interaction.guild.members.cache.find(m => m.id == ticket.author)}
> ・**verified by:** ${interaction.user}`),
                ],
            });
        }
        }
    },
};