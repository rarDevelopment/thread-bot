const MessageColors = require('discord-helper-lib/MessageColors');
const MessageSender = require('discord-helper-lib/MessageSender.js');
const ThreadListUpdater = require("../business/ThreadListUpdater");
const ChannelValidator = require("discord-helper-lib/ChannelValidator");
const RoleHelper = require("discord-helper-lib/RoleHelper");
const resources = require("../resources.json");
require("dotenv").config();

class SetThreadChannel {
    constructor() {
        this.name = 'set';
        this.cooldown = 2;
        this.help = {
            message: `Set the channel for the thread list to appear in.`,
            usage: 'set',
            example: ['set'],
            inline: true,
        };

        this.MessageSender = new MessageSender();
        this.MessageColors = new MessageColors();
    }

    async execute(msg, args) {
        const roleHelper = new RoleHelper([process.env.OWNER], [], resources.requiredPermissions);
        if (!roleHelper.canAdministrate(msg.member)) {
            msg.addReaction("❌");
            return;
        }
        let channelIdToMessage = msg.channel.id;
        if (args.length > 0) {
            const channelInput = args[0];
            const isChannel = new ChannelValidator().isChannel(channelInput);
            if (isChannel) {
                channelIdToMessage = channelInput.replace('<#', '').replace('>', '');
            }
        }
        const messageId = await ThreadListUpdater.updateThreadsList(msg.channel.guild, channelIdToMessage);
        await ThreadListUpdater.setThreadListMessage(msg.guildID, channelIdToMessage, messageId);
        msg.addReaction("✅");
    }
}
module.exports = new SetThreadChannel();
