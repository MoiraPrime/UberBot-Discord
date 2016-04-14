module.exports = function(statusReport) {
    return {
        "triggers": ["google", "g"],
        "meta": {
            "name": "Google",
            "usage": "&google <search terms>",
            "description": "Googles a given term, and returns the first link-based result it finds."
        },
        "callback": function(channelID, user, userID, message, msplit) {
            var bot = require.main.exports.bot;
            statusReport("INFO: Responding to google request from " + user);
            var google = require('google');
            google.resultsPerPage = 5;
            var sliceby = 9;
            if (msplit[0] === "g") {
                sliceby = 4;
            }
            if ((sliceby == 9 && message.length < 9) || (sliceby == 4 and message.length <4)) {
                bot.sendMessage({
                    to: channelID,
                    message: "Sorry, but you must specify search terms."
                });
                return;
            }
            google(message.slice(sliceby), function(err, next, links) {
                if (err) {
                    statusReport(err)
                }
                for (i = 0; i < 5; i++) {
                    if (links[i].link) {
                        bot.sendMessage({
                            to: channelID,
                            message: links[i].title + "\n" + links[i].link
                        });
                        break;
                    } else if (i === 5) {
                        bot.sendMessage({
                            to: channelID,
                            message: "Sorry! None of the first 5 results returned any links."
                        });
                    }
                }
            });
        }
    };
};