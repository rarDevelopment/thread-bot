require("dotenv").config();
const Eris = require("eris");
const mongoose = require("mongoose");

const ThreadCreate = require('./events/ThreadCreate');
const ThreadUpdate = require('./events/ThreadUpdate');
const ThreadDelete = require('./events/ThreadDelete');
const MessageCreate = require('./events/MessageCreate');

const bot = new Eris.Client(process.env.BOT_TOKEN, {
    intents: 32571
});

bot.on("ready", function (evt) {
    console.log(`Logged in as ${bot.user.username} (${bot.user.id})`);

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@discordbots.ywjdt.mongodb.net/threadbot?retryWrites=true&w=majority`;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', function () {
        console.log("Connected to MongoDB");
    });

    bot.editStatus('online', { name: 'Threading the Needle', type: 1 });
});

ThreadCreate.setupThreadCreateEvent(bot);
ThreadUpdate.setupThreadUpdateEvent(bot);
ThreadDelete.setupThreadDeleteEvent(bot);
MessageCreate.setupMessageCreateEvent(bot);


bot.on("error", (err) => {
    console.error(err);
});

bot.connect();
