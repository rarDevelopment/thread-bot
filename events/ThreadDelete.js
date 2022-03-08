const ThreadListUpdater = require('../business/ThreadListUpdater');

exports.setupThreadDeleteEvent = async function (bot) {
    bot.on("threadDelete", async (thread) => {
        ThreadListUpdater.updateThreadsList(thread.guild);
    });
}
