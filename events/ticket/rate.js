const StatsTickets = require('../../schemas/stats_tickets.js');
const mongoose = require('mongoose');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.customId?.startsWith('tickets_rate')) return;
        const stats = await StatsTickets.findOne();
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
        }
        interaction.customId.charAt(interaction.customId.length - 1) == '1' ? stats.veryBad++ : interaction.customId.charAt(interaction.customId.length - 1) == '2' ? stats.bad++ : interaction.customId.charAt(interaction.customId.length - 1) == '3' ? stats.neutral++ : interaction.customId.charAt(interaction.customId.length - 1) == '4' ? stats.good++ : stats.veryGood++;
        await stats.save();
        await interaction.message.delete().catch(async () => { return; });
    },
};