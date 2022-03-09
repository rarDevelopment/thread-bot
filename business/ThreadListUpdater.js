const { ThreadListMessage } = require("../models/ThreadListMessage");
const MessageWithEmbed = require("discord-lib/MessageWithEmbed");
const MessageColors = require("discord-lib/MessageColors");
const EmbedField = require("discord-lib/EmbedField");
const MessageSender = require("discord-lib/MessageSender");
const DiscordUrlBuilder = require("discord-lib/DiscordUrlBuilder");

class ThreadListUpdater {
    NoActiveThreadsEmbed = [{
        name: 'No Active Threads',
        value: 'No threads are currently active on the server.',
        inline: false
    }];
    ActiveThreadsTitle = 'Active Threads';
    NoActiveThreadsTitle = 'No Active Threads';
    FooterText = "Regards, Theodore";

    async updateThreadsList(guild, channelIdToSendTo = null) {
        const discordUrlBuilder = new DiscordUrlBuilder(guild.id);
        const channelThreads = guild.threads.filter(t => !t.threadMetadata.archived).map(t => {
            const parentChannel = guild.channels.find(c => c.id === t.parentID);
            return {
                threadName: t.name,
                threadUrl: discordUrlBuilder.buildChannelUrl(t.id),
                channel: parentChannel,
                channelUrl: discordUrlBuilder.buildChannelUrl(t.parentID)
            }
        });

        let threadsByChannel = {};

        channelThreads.forEach(ct => {
            const threadLink = `[${ct.threadName}](${ct.threadUrl})`;
            if (threadsByChannel[ct.channel.name]) {
                threadsByChannel[ct.channel.name].push(threadLink)
            }
            else {
                threadsByChannel[ct.channel.name] = [threadLink];
            }
        });

        const embedFieldsToAdd = [];

        for (const channel in threadsByChannel) {
            embedFieldsToAdd.push(new EmbedField(`#${channel}`, threadsByChannel[channel].join(', '), false));
        }

        const messageToSend = new MessageWithEmbed(
            null,
            embedFieldsToAdd.length > 0 ? this.ActiveThreadsTitle : this.NoActiveThreadsTitle,
            embedFieldsToAdd.length > 0 ? embedFieldsToAdd : this.NoActiveThreadsEmbed,
            this.FooterText,
            null,
            new MessageColors().RegularColor,
            null
        );

        let threadListMessage = await this.getThreadListMessage(guild.id);
        // this overrides the threadListMessage because it should only be used when a new channel is being set
        if (channelIdToSendTo) {
            threadListMessage = {
                channelId: channelIdToSendTo,
                listMessageId: null
            }
        }
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
                    footer: { text: messageToSend.footerText },
                    title: messageToSend.title,
                    fields: messageToSend.embedFields.length > 0
                        ? messageToSend.embedFields.map(field => {
                            return {
                                name: field.name,
                                value: field.value,
                                inline: false
                            };
                        })
                        : this.NoActiveThreadsEmbed
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
