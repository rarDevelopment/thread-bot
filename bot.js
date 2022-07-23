require("dotenv").config();
const Eris = require("eris");
const mongoose = require("mongoose");

const ThreadCreate = require('./events/ThreadCreate');
const ThreadUpdate = require('./events/ThreadUpdate');
const ThreadDelete = require('./events/ThreadDelete');
const SetThreadChannel = require("./commands/SetThreadChannel");
const UpdateThreadsList = require("./commands/UpdateThreadsList");
const Version = require("./commands/Version");

const commands = [
    SetThreadChannel,
    UpdateThreadsList,
    Version
];

const bot = new Eris.CommandClient(process.env.BOT_TOKEN, {}, {
    intents: 32571,
    prefix: ["thread.", "Thread."]
});

bot.on("ready", function (evt) {
    console.log(`Logged in as ${bot.user.username} (${bot.user.id})`);

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.MONGO_SUBDOMAIN}.mongodb.net/threadbot?retryWrites=true&w=majority`;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', function () {
        console.log("Connected to MongoDB");
    });

    commands.forEach(command => {
        console.log("setting up command: ", command);
        bot.registerCommand(command.name, command.execute.bind(command), {
            description: command.help.usage,
            fullDescription: command.help.message
        });
        if (command.aliases) {
            command.aliases.forEach(alias => {
                bot.registerCommandAlias(alias, command.name);
            });
        }
    });

    bot.editStatus('online', { name: 'Threading the Needle', type: 1 });
});

ThreadCreate.setupThreadCreateEvent(bot);
ThreadUpdate.setupThreadUpdateEvent(bot);
ThreadDelete.setupThreadDeleteEvent(bot);

bot.on("error", (err) => {
    console.error(err);
});

bot.connect();
