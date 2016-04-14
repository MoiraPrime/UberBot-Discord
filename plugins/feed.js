/* const feedSub = require("feedsub"),
    feedList = [
        {
            "url": "https://firepoweredgaming.com/forums/rss/forums/1-news-announcements/",
            "name": "FirePowered Announcements"
        }, {
            "url": "https://xkcd.com/rss.xml",
            "name": "XKCD"
        }, {
            "url": "https://steamcommunity.com/groups/toonhud/rss/",
            "name": "ToonHud Announcements"
        }, {
            "url": "https://www.mail-archive.com/hlds_announce@list.valvesoftware.com/maillist.xml",
            "name": "HLDS Announce"
        }, {
            "url": "http://www.teamfortress.com/rss.xml",
            "name": "TF2 Blog"
        }
],
    options = {
        interval: 1,
        skipHours: true,
        skipDays: true
    }; */

module.exports = (statusReport) => {
    return {
        "name": "Feed Announcer",
        "version": "0.1.2",
        "disabled": true,
        "author": "UberActivist",
        "callback": () => {
            const bot = require.main.exports.bot;
            feedList.forEach((list) => {
                var feed = new feedSub(list.url, options);
                console.log(`Tracking feed ${list.name}. Last Item was published on ${feed.lastDate}`);
                feed.on("item", (item) => {
                    bot.sendMessage({to: "158357071815901184", message: `**${list.name} RSS:** ${item.title} ―― ${item.link}`});
                });
                feed.start();
            }

            );
        }
    };
}
