const mongoose = require("mongoose");

const threadListMessageSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    listMessageId: String
}, { collection: 'threadlistmessages' });

module.exports = {
    ThreadListMessage: mongoose.model('threadlistmessages', threadListMessageSchema, 'threadlistmessages')
}
