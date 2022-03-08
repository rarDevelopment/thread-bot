const { ThreadListMessage } = require("../models/ThreadListMessage");
const MessageWithEmbed = require("discord-lib/MessageWithEmbed");
const MessageColors = require("discord-lib/MessageColors");
const EmbedField = require("discord-lib/EmbedField");
const MessageSender = require("discord-lib/MessageSender");

class ThreadListUpdater {
    async updateThreadsList(guild) {
        const channelThreads = guild.threads.map(t => {
            const channel = guild.channels.find(c => c.id === t.parentID);
            return {
                threadName: t.name,
                channel: channel
            }
        });

        let threadsByChannel = {};

        channelThreads.forEach(ct => {
            if (threadsByChannel[ct.channel.name]) {
                threadsByChannel[ct.channel.name].push(ct.threadName)
            }
            else {
                threadsByChannel[ct.channel.name] = [ct.threadName];
            }
        });

        const messageToSend = new MessageWithEmbed(
            null,
            "Active Threads",
            [],
            "Brought to you by rardk64",
            null,
            new MessageColors().RegularColor,
            null
        );

        for (const channel in threadsByChannel) {
            messageToSend.embedFields.push(new EmbedField(`#${channel}`, threadsByChannel[channel].join(', ')));
        }

        const threadListMessage = await this.getThreadListMessage(guild.id);
        if (threadListMessage) {
            const messageSender = new MessageSender();
            const channel = guild.channels.find(c => c.id === threadListMessage.channelId);
            if (!channel) {
                console.error(`Channel not found with channel ID ${threadListMessage.channelId}`);
                return null;
            }
            const messageToUpdate = threadListMessage.listMessageId
                ? await channel.getMessage(threadListMessage.listMessageId)
                : null;
            if (!messageToUpdate) {
                return messageSender.sendMessage(messageToSend.buildMessage(), channel, null).then(messageSent => {
                    return messageSent.id;
                });
            }
            else {
                await messageSender.editMessageWithEmbed({
                    description: messageToSend.description,
                    fields: messageToSend.embedFields.map(field => {
                        return {
                            name: field.name,
                            value: field.value,
                            inline: field.inline
                        };
                    })
                }, messageToUpdate);
                return messageToUpdate.id;
            }
        }
    }

    getThreadListMessage(guildId) {
        return ThreadListMessage.findOne({ guildId: guildId });
    }

    setThreadListMessage(guildId, channelId, listMessageId) {
        return this.getThreadListMessage(guildId).then(existingThreadListMessage => {
            let tlmToSave = existingThreadListMessage;
            if (!existingThreadListMessage) {
                tlmToSave = new ThreadListMessage(
                    {
                        guildId: guildId,
                        channelId: channelId,
                        listMessageId: listMessageId
                    }
                );
            }
            tlmToSave.guildId = guildId;
            tlmToSave.channelId = channelId;
            tlmToSave.listMessageId = listMessageId;
            return tlmToSave.save()
                .then(() => {
                    return true;
                }).catch(err => {
                    console.error("Error setting ThreadListMessage: ", err);
                    return false;
                });
        });
    }
}

module.exports = new ThreadListUpdater();
