const Ticket = require('../../schemas/ticket');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if (!message.inGuild() || message.channel?.parentId !== '1092188385583579256' || message.author.bot) return;
        const ticket = await Ticket.findOne({ channel: message.channel.id, open: true });
        if (!ticket || ticket.handledBy.includes(message.author.id) || ticket.author == message.author.id) return;
        ticket.handledBy.push(message.author.id);
        await ticket.save();
    },
};