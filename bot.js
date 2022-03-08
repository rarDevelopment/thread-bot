require("dotenv").config();
const Eris = require("eris");

const ThreadCreate = require('./events/ThreadCreate');
const ThreadUpdate = require('./events/ThreadUpdate');
const ThreadDelete = require('./events/ThreadDelete');

const bot = new Eris.Client(process.env.BOT_TOKEN, {
    intents: 32571
});

bot.on("ready", function (evt) {
    console.log(`Logged in as ${bot.user.username} (${bot.user.id})`);

    bot.editStatus('online', { name: 'Threading the Needle', type: 1 });
});

ThreadCreate.setupThreadCreateEvent(bot);
ThreadUpdate.setupThreadUpdateEvent(bot);
ThreadDelete.setupThreadDeleteEvent(bot);

bot.on("error", (err) => {
    console.error(err);
});

bot.connect();


// const Chariot = require("chariot.js");
// class ThreadBot extends Chariot.Client {
//     constructor() {
//         super(new Chariot.Config(
//             process.env.BOT_TOKEN,
//             {
//                 prefix: ["thread."],
//                 defaultHelpCommand: true,
//                 primaryColor: 'ORANGE',
//                 excludeDirectories: [],
//                 owner: [
//                     "234356032099450890"
//                 ]
//             },
//             {
//                 messageLimit: 50,
//                 defaultImageFormat: 'png',
//                 getAllUsers: true,
//                 intents: 32571
//             }
//         ));
//     }
// }



// module.exports = new ThreadBot();
