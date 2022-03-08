exports.setupThreadDeleteEvent = async function (bot) {
    bot.on("threadDelete", async (channel) => {
        console.log(channel);
    });
}
