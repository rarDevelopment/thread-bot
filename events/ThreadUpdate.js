const ThreadListUpdater = require('../business/ThreadListUpdater');

exports.setupThreadUpdateEvent = async function (bot) {
    bot.on("threadUpdate", async (thread, oldChannel) => {
        ThreadListUpdater.updateThreadsList(thread.guild);
    });
}
