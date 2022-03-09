const packageJson = require('../package.json');
const ThreadListUpdater = require("../business/ThreadListUpdater");
const ChannelValidator = require("discord-lib/ChannelValidator");
const MessageSender = require("discord-lib/MessageSender");

exports.setupMessageCreateEvent = function (bot) {
    bot.on('messageCreate', async (msg) => {
        //ignore bots
        if (msg.author.bot) {
            return;
        }

        const inputSplit = msg.content.split(' ').map(s => s.toLowerCase().trim());

        if (inputSplit && inputSplit.length > 0) {
            const commandText = inputSplit[0];

            switch (commandText) {
                case "thread.set":
                    let channelIdToMessage = msg.channel.id;
                    if (inputSplit.length > 1) {
                        const channelInput = inputSplit[1];
                        const isChannel = new ChannelValidator().isChannel(channelInput);
                        if (isChannel) {
                            channelIdToMessage = channelInput.replace('<#', '').replace('>', '');
                        }
                    }
                    const messageId = await ThreadListUpdater.updateThreadsList(msg.channel.guild, channelIdToMessage);
                    await ThreadListUpdater.setThreadListMessage(msg.guildID, channelIdToMessage, messageId);
                    break;
                case "thread.update":
                    await ThreadListUpdater.updateThreadsList(msg.channel.guild);
                    msg.addReaction("✅");
                    break;
                case "thread.version":
                case "thread.v":
                    var messageSender = new MessageSender();
                    messageSender.sendMessage(`Theodore is at version ${packageJson.version}`, msg.channel, null);
                    break;
                default:
                    return;
            }
        }
    });
}
