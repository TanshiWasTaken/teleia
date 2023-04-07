const [fs, path] = [require('node:fs'), require('node:path')];
const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const commandsPath = path.join(__dirname, '../../commands');
        const commandSubFolders = fs.readdirSync(commandsPath);
        for (let i = 0; i < commandSubFolders.length; i++) {
            const commandFolder = commandSubFolders[i];
            const commandFiles = fs.readdirSync(`${commandsPath}/${commandFolder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const commandFilePath = path.join(`${commandsPath}/${commandFolder}`, file);
                const command = require(commandFilePath);
                client.commands.set(command.data.name, command);
            }
        }
    },
};