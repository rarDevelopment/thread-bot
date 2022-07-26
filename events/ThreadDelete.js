const DiscordEvent = require('discord-helper-lib/DiscordEvent');
const ThreadListUpdater = require('../business/ThreadListUpdater');

module.exports = class ThreadDelete extends DiscordEvent {
    constructor(bot) {
        super('threadDelete', bot);
    }

    async execute(thread) {
        ThreadListUpdater.updateThreadsList(thread.guild);
    }
}
