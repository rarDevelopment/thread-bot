const MessageColors = require('discord-helper-lib/MessageColors');
const MessageSender = require('discord-helper-lib/MessageSender.js');
const ThreadListUpdater = require("../business/ThreadListUpdater");
const RoleHelper = require("discord-helper-lib/RoleHelper");
const resources = require("../resources.json");
require("dotenv").config();

class UpdateThreadsList {
    constructor() {
        this.name = 'update';
        this.cooldown = 2;
        this.help = {
            message: `Set the channel for the thread list to appear in.`,
            usage: 'update',
            example: ['update'],
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
        await ThreadListUpdater.updateThreadsList(msg.channel.guild);
        msg.addReaction("✅");
    }
}
module.exports = new UpdateThreadsList();
