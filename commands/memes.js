module.exports = function (statusReport) {
	return {
		"triggers": ["meme","maymay","dankmemes", "lenny", "disapprove", "shrug", "sunglasses"],
		"meta": {
			"name": "Memes",
			"usage": "&meme <meme type>",
			"description": "Allows the user to request one of 4 popular text memes to use."
		},
		"callback": function(channelID, user, userID, message, msplit) {
			var bot = require.main.exports.bot,
				memes = ["( ͡° ͜ʖ ͡°)","ಠ_ಠ","¯\\\\\\_(ツ)_/¯","(•\\_•)  ( •\\_•)>⌐■-■  (⌐■\\_■)"],
				random = require("random-js");
			if (msplit[0] === "meme" && msplit[1]) {
				switch (msplit[1]) {
					case "lenny":
						bot.sendMessage({to:channelID, message:"( ͡° ͜ʖ ͡°)"});
						break;
					case "disapprove":
						bot.sendMessage({to:channelID, message:"ಠ_ಠ"});
						break;
					case "shrug":
						bot.sendMessage({to:channelID, message:"¯\\\\\\_(ツ)_/¯"});
						break;
					case "sunglasses":
						bot.sendMessage({to: channelID, message: "(•\\_•)  ( •\\_•)>⌐■-■  (⌐■\\_■)"});
						break;
				}
				return;
			}
			if (msplit[0] === "meme") {
				var pick = random.pick(random.engines.nativeMath, memes);
				bot.sendMessage({to: channelID, message: pick});
				return;
			}
			switch (msplit[0]) {
				case "lenny":
					bot.sendMessage({to:channelID, message:"( ͡° ͜ʖ ͡°)"});
					break;
				case "disapprove":
					bot.sendMessage({to:channelID, message:"ಠ_ಠ"});
					break;
				case "shrug":
					bot.sendMessage({to:channelID, message:"¯\\\\\\_(ツ)_/¯"});
					break;
				case "sunglasses":
					bot.sendMessage({to: channelID, message: "(•\\_•)  ( •\\_•)>⌐■-■  (⌐■\\_■)"});
					break;
				default:
					bot.sendMessage({to: channelID, message: "You have to pick one, first. Choices: lenny, disapprove, shrug, sunglasses"});
			}
		}
	};
};
