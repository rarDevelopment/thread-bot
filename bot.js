require("dotenv").config();
const Eris = require("eris");
const mongoose = require("mongoose");

const ThreadCreate = require('./events/ThreadCreate');
const ThreadUpdate = require('./events/ThreadUpdate');
const ThreadDelete = require('./events/ThreadDelete');
const SetThreadChannel = require("./commands/SetThreadChannel");
const UpdateThreadsList = require("./commands/UpdateThreadsList");
const Version = require("./commands/Version");
const CommandRegistration = require('discord-helper-lib/CommandRegistration');
const EventRegistration = require('discord-helper-lib/EventRegistration');

const bot = new Eris.CommandClient(process.env.BOT_TOKEN, {
    intents: 32571,
}, {
    prefix: ["thread.", "Thread."],
    ignoreBots: true,
    ignoreSelf: true
});

const commands = [
    SetThreadChannel,
    UpdateThreadsList,
    Version
];

const events = [
    new ThreadCreate(bot),
    new ThreadUpdate(bot),
    new ThreadDelete(bot)
];

bot.once("ready", function (evt) {
    new CommandRegistration().registerCommands(bot, commands);
});

new EventRegistration().registerEvents(bot, events);

bot.on("ready", function (evt) {
    console.log(`Logged in as ${bot.user.username} (${bot.user.id})`);

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.MONGO_SUBDOMAIN}.mongodb.net/threadbot?retryWrites=true&w=majority`;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', function () {
        console.log("Connected to MongoDB");
    });

    bot.editStatus('online', { name: 'Threading the Needle', type: 1 });
});

bot.on("error", (err) => {
    console.error(err);
});

bot.connect();
