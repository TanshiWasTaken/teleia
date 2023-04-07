const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clears messages from a channel')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('amount of messages to clear')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true),
        ),
    async execute(interaction) {
        const noperms = [
            'hey, you don\'t have the perms you need for that',
            'sorry, you don\'t have the right perms for that command',
            'you\'re not allowed to use that command',
            'this command is meant for some1 with higher perms, sorry',
            'no can do buckaroo',
            'no.',
            'i don\'t feel like it',
            'shrug',
            'maybe if u ask me reeeeeeeeally nicely... /s',
        ];

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: `${noperms[Math.floor(Math.random() * noperms.length)]}` });
        const amount = interaction.options.getInteger('amount');
        interaction.channel.bulkDelete(amount)
            .then(messages => {
                const chance = Math.floor(Math.random() * 100);
                const ok = [
                    'ok',
                    'okay',
                    'okie dokie',
                    'alright',
                    'alrighty',
                    'mkay',
                    'mission success',
                ];
                const nomsg = [
                    'there\'s no msgs for me to delete lol',
                    'what do you want me to delete?',
                    'there\'s nothing here',
                    'there aren\'t any messages in this channel',
                    'i\'ve deleted 0 messages! feel productive yet? /lh',
                    'i don\'t know what you want me to delete',
                    'my condolences, you must be blind /lh',
                ];
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(messages.size !== 0 ? interaction.guild.members.cache.find(m => m.id == process.env.CLIENT_ID).displayHexColor : `#${process.env.WARNING_COLOUR}`)
                            .setDescription(messages.size !== 0 ? (chance > 5 ? `${ok[Math.floor(Math.random() * ok.length)]}, ${messages.size} ${messages.size > 1 ? 'messages have' : 'message has'} been deleted!` : 'k.') : nomsg[Math.floor(Math.random() * nomsg.length)]),
                    ],
                }).catch(() => { return; });
                setTimeout(async () => { await interaction.deleteReply().catch(() => { return; }); }, 1500);
            })
            .catch(error => console.log(error));
    },
};