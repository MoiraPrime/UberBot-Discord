var afkList = {}

module.exports = (statusReport) => {
    return {
        "triggers": ["away"],
        "meta": {
            "name": "Away Manager",
            "usage": "&away <reason>",
            "description": "Lets you set yourself as away, and notifies anyone mentioning you of your absense. (DM Only)"
        },
        "info": afkList,
        "callback": (channelID, user, userID, message, msplit) => {
            const bot = require.main.exports.bot;
            if (!(channelID in bot.directMessages)) {
                bot.sendMessage({
                    to: channelID,
                    message: "You may only use this command in Direct Messages."
                });
                return;
            }
            if (userID in afkList) {
                bot.sendMessage({
                    to: channelID,
                    message: `Your away message has been removed. You have been away since ${afkList[userID].date.toString()}.`
                });
                delete afkList[userID];
                return;
            }
            var mess = message.slice(6);
            var tm = new Date();
            afkList[userID] = {
                "message": mess,
                "date": tm
            };
            bot.sendMessage({
                to: channelID,
                message: `You are now away with message ${mess} as of ${tm.toString()}.`
            });
        }
    };
}