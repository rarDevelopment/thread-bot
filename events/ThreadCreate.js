const DiscordEvent = require('discord-helper-lib/DiscordEvent');
const ThreadListUpdater = require('../business/ThreadListUpdater');

module.exports = class ThreadCreate extends DiscordEvent {
    constructor(bot) {
        super('threadCreate', bot);
    }

    async execute(thread) {
        ThreadListUpdater.updateThreadsList(thread.guild);
    }
}
