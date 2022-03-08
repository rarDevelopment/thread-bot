const ThreadListUpdater = require('../business/ThreadListUpdater');

exports.setupThreadCreateEvent = async function (bot) {
    bot.on("threadCreate", async (thread) => {
        ThreadListUpdater.updateThreadsList(thread.guild);
    });
}
