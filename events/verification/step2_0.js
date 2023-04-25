const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.customId !== 'verification2' || !interaction.isButton()) return;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOUR)
                    .setDescription(`⸝⸝ ★ __***\`VERIFY\`***__ ***!*** . . .\n
✰ \`O4\` — **__onto the next step__ *!***
> there's a few more things to go over, but you're almost done!`),
            ],
            ephemeral: true,
        });
    },
};