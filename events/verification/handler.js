const step1_1 = require('./step1_1');
const step1_2 = require('./step1_2');
const step1_3 = require('./step1_3');
const step1_4 = require('./step1_4');
const step1_5 = require('./step1_5');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        switch (interaction.customId) {
        case 'age': {
            step1_2.execute(interaction);
            break;
        }
        case 'pronouns': {
            step1_3.execute(interaction);
            break;
        }
        case 'pings': {
            step1_4.execute(interaction);
            break;
        }
        case 'dms': {
            step1_5.execute(interaction);
            break;
        }
        case 'retry_verification1': {
            step1_1.execute(interaction);
            break;
        }
        default: {
            return;
        }
        }
    },
};