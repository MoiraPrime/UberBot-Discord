var awayList = require("../commands/afk.js")().info;

module.exports = (statusReport) => {
    return {
        "name": "Away Manager Mention Plugin",
        "version": "0.0.5",
        "author": "UberActivist",
        "callback": () => {
            var bot = require.main.exports.bot;
            bot.on("message", (user, userID, channelID, message, rawEvent) => {
            	if (userID == bot.id) {
            		return;
            	}
                for (var i in awayList && !(channelID in bot.directMessages)) {
                	if (i == userID) {
                		bot.sendMessage({to: i, message: "If you are no longer away, remember to toggle away off with the &away command."});
                		return;
                	}
                    if (message.includes(`<@${i}`)) {
                        bot.sendMessage({
                            to: channelID,
                            message: `Sorry, but <@${i}> is away at ${awayList[i].date.toString()} with the following message: ${awayList[i].message}`
                        });
                        bot.sendMessage({
                            to: i,
                            message: `<@${userID}> attempted to message you while you were away in <#${channelID}> with the following message: ${message}`
                        });
                    }
                }
            });
        }
    };
}