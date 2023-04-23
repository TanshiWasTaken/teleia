module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        const unverifiedRole = member.guild.roles.cache.find(r => r.id == '1094017926090211490');
        await member.roles.add(unverifiedRole);
    },
};