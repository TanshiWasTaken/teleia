const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const StatsTickets = require('../../schemas/stats_tickets');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('get statistics')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('tickets')
                .setDescription('get ticket statistics'),
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
        case 'tickets': {
            let stats = await StatsTickets.findOne();
            if (!stats) {
                await StatsTickets.create({
                    _id: new mongoose.Types.ObjectId(),
                    nSupport: 0,
                    nConnections: 0,
                    nReport: 0,
                    nAppeal: 0,
                    nVerify: 0,
                    bad: 0,
                    veryBad: 0,
                    neutral: 0,
                    good: 0,
                    veryGood: 0,
                });
                stats = await StatsTickets.findOne();
            }
            const categories = [
                { name: 'support', value: stats.nSupport },
                { name: 'connections', value: stats.nConnections },
                { name: 'report', value: stats.nReport },
                { name: 'appeal', value: stats.nAppeal },
                { name: 'verify', value: stats.nVerify },
            ];
            categories.sort((a, b) => b.value - a.value);
            const total = categories.reduce((acc, category) => acc + category.value, 0);

            const ratings = [
                { name: 'very good', value: stats.veryGood, fullEmoji: '<:sc_teal_full:1102042385241866271>', halfEmoji: '<:sc_teal_half:1102042363372769371>' },
                { name: 'good', value: stats.good, fullEmoji: '<:sc_green_full:1102042336889929778>', halfEmoji: '<:sc_green_half:1102042314010021898>' },
                { name: 'neutral', value: stats.neutral, fullEmoji: '<:sc_yellow_full:1102042285312573582>', halfEmoji: '<:sc_yellow_half:1102042251196108870>' },
                { name: 'bad', value: stats.bad, fullEmoji: '<:sc_orange_full:1103045327164031036>', halfEmoji: '<:sc_orange_half:1102041904142635119>' },
                { name: 'very bad', value: stats.veryBad, fullEmoji: '<:sc_red_full:1102041866704261161>', halfEmoji: '<:sc_red_half:1102039031325401118>' },
            ];
            const totalReviews = ratings.reduce((acc, rating) => acc + rating.value, 0);
            const emptyEmoji = '<:sc_empty:1102038936576065596>';
            const graphs = [];
            for (let i = 0; i < ratings.length; i++) {
                const rating = ratings[i];
                const percentage = isNaN((rating.value / totalReviews) * 100) ? 0 : /\.([1-9])/.exec((rating.value / totalReviews) * 100) ? /\.([1-9])/.exec(((rating.value / totalReviews) * 100).toFixed(1)) ? ((rating.value / totalReviews) * 100).toFixed(1) : Math.floor(((rating.value / totalReviews) * 100).toFixed(1)) : Math.floor((rating.value / totalReviews) * 100);
                const full = Math.floor(percentage / 10);
                const half = Math.floor((percentage % 10) / 5);
                const empty = 10 - full - half;
                graphs.push(`・**${rating.name} —** \`${rating.value.toLocaleString()}\`\n> ${rating.fullEmoji.repeat(full)}${rating.halfEmoji.repeat(half)}${emptyEmoji.repeat(empty)} **${percentage.toLocaleString()}%**`);
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOUR)
                        .setDescription(`⸝⸝ ★ __***\`${interaction.options.getSubcommand().toUpperCase()} STATISTICS\`***__ ***!*** . . .\n
✰ \`O1\` — **__number of tickets by category__ *!***
> ${categories.map((category) => { const percentage = isNaN((category.value / total) * 100) ? 0 : /\.([1-9])/.exec((category.value / total) * 100) ? /\.([1-9])/.exec(((category.value / total) * 100).toFixed(1)) ? ((category.value / total) * 100).toFixed(1) : Math.floor(((category.value / total) * 100).toFixed(1)) : Math.floor((category.value / total) * 100); return `・**${category.name}:** \`${category.value.toLocaleString()}\` **(${percentage.toLocaleString()}%)**`; }).join('\n> ')}
> ・**total:** \`${total.toLocaleString()}\`

✰ \`O2\` — **__rating__ *!***
> ・**total reviews:** \`${totalReviews.toLocaleString()}\`
> ${graphs.join('\n> ')}`),
                ],
            });
        }
        }
    },
};