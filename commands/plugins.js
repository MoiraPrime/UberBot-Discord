module.exports = (statusReport, list) => {
    return {
        "triggers": ["plugins"],
        "meta": {
            "name": "Plugins List",
            "usage": "&plugins",
            "description": "Returns a list of the loaded plugins."
        },
        "callback": (channelID, user, userID, message, msplit) => {
            const bot = require.main.exports.bot;
            var creator = "**Name**, **Version**, **Author**, **Status**\n";
            list.forEach((item) => {
                creator = creator + item + "\n";
            });
            bot.sendMessage({to: channelID, message: creator});
        }
    };
}
