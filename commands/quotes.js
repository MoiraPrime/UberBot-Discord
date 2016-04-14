module.exports = function(statusReport) {
    return {
        "triggers": ["quote"],
        "meta": {
            "name": "Quote",
            "usage": "&quote <number> or (Admin Only) &quote add <quote>",
            "description": "Provides you with a specific quote if you provide a number, or a random one if you don't."
        },
        "callback": function(channelID, user, userID, message, msplit) {
            var bot = require.main.exports.bot,
                con = require.main.exports.mysql;
            if (typeof msplit[1] === "undefined") {
                con.query("SELECT * FROM quotes ORDER BY RAND() LIMIT 1", function(err, rows) {
                    if (err) {
                        statusReport("There was a problem: " + err);

                        return;
                    }
                    con.query("SELECT COUNT(id) AS count FROM quotes", function(err, total) {
                        if (err) {
                            console.log(err);

                            return;
                        }

                        bot.sendMessage({
                            to: channelID,
                            message: "[" + rows[0].id + "/" + total[0].count + "] " + rows[0].quote + "\nAdded by: " + rows[0].addedby
                        });
                    });
                });

                return;
            }
            if (msplit[1] == "add") {
                if (!bot.serverFromChannel(channelID) in bot.servers) {
                    return;
                }
                var rolecheck = bot.servers[bot.serverFromChannel(channelID)].members[userID].roles;
                var approve = false;
                for (var i = 0; i < rolecheck.length; i++) {
                    if (rolecheck[i] == "149707763205931010") {
                        approve = true;
                        break;
                    }
                }
                if (!approve) {
                    bot.sendMessage({
                        to: channelID,
                        message: "You do not have permission to use this command."
                    });
                    return;
                }
                var info = {
                    quote: message.slice(10),
                    addedby: user
                };
                con.query("INSERT INTO quotes SET ?", info, function(err, res) {
                    if (err) {
                        console.log("There was a problem: " + err);

                        return;
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: "Successfully added quote #" + res.insertId
                    });
                });

                return;
            }
            if (!parseInt(msplit[1])) {
                bot.sendMessage({
                    to: channelID,
                    message: "Sorry, that was not a valid quote number."
                });
                return;
            }
            con.query("SELECT * FROM quotes WHERE id=" + msplit[1], function(err, rows) {
                if (err) {
                    bot.sendMessage({
                        to: channelID,
                        message: "There is no quote with that number."
                    });
                    return;
                }
                con.query("SELECT COUNT(id) AS count FROM quotes", function(err, total) {
                    if (err) {
                        console.log(err);

                        return;
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: "[" + rows[0].id + "/" + total[0].count + "] " + rows[0].quote + "\nAdded by: " + rows[0].addedby
                    });
                });
            });
        }
    };
};