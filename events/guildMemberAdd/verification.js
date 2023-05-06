module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        await member.roles.add('1094017926090211490');
    },
};