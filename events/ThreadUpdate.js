exports.setupThreadUpdateEvent = async function (bot) {
    bot.on("threadUpdate", async (channel, oldChannel) => {
        console.log("channel", channel);
        console.log("old channel", oldChannel);
    });
}
