const DiscordEvent = require('discord-helper-lib/DiscordEvent');
const ThreadListUpdater = require('../business/ThreadListUpdater');

module.exports = class ThreadUpdate extends DiscordEvent {
    constructor(bot) {
        super('threadUpdate', bot);
    }

    async execute(thread, oldChannel) {
        ThreadListUpdater.updateThreadsList(thread.guild);
    }
}
