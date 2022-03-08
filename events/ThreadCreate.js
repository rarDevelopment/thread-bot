exports.setupThreadCreateEvent = async function (bot) {
    bot.on("threadCreate", async (channel) => {
        console.log(channel);
    });
}

// const Chariot = require('chariot.js');

// class ThreadCreate extends Chariot.Event {
//     constructor() {
//         super('threadCreate');
//     }

//     async execute(channel) {
//         console.log(channel);
//     }
// }

// module.exports = new ThreadCreate();
