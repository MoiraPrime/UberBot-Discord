module.exports = (statusReport) => {
    return {
        "name": "Join and Leave Announcer",
        "version": "0.0.5",
        "author": "UberActivist",
        "callback": () => {
            const bot = require.main.exports.bot;
            bot.on("guildMemberAdd", (userbroken, event) => {
                if (event.d.guild_id != "149707514521321473") {
                    return;
                }
                var user = event.d.user,
                    userID = user.id;

                bot.sendMessage({
                    to: "158357071815901184",
                    message: `Everyone welcome <@${userID}> to the server! Hi there ${user.username}!`
                });
                bot.sendMessage({
                    to: userID,
                    message: `Hello there, ${user}! Welcome to FP & Friends. Please be mindful of our rules, which are located in <#${"149708109265240064"}> and have a very nice day!`
                });
            });
            bot.on("guildMemberRemove", (userbroken, event) => {
                if (event.d.guild_id != "149707514521321473") {
                    return;
                }
                var user = event.d.user,
                    userID = user.id;
                bot.sendMessage({
                    to: "158357071815901184",
                    message: `Unfortunately, <@${userID}> has left the server. :(`
                });
            });
        }
    };
}