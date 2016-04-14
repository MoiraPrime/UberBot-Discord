var gameState = ["Half-Life 3", "rannmann's Pool Party 2","Cayda's Mumble Mixers","LBJ's 2 TB Anime Collection","Jack's Anime Adventure","McKay's 150 GB Stargate Collection","Undertale","Monopoly: Donald Trump Edition","Waifu or Weirdo","rameys340's Nintendo Obsession","Jack's Splatoon Obsession","Pariah's Emoticons","Teem 4Truss Too","DotA 3: Russian Paradise","Counter-Strike: Global Foreskins","/r/4chan","Destroy all Humans: The Videogame","Blackjack","Poker Night 3","The Game"],
	random = require("random-js")();


module.exports = (statusReport) => {
	return {
		"name": "Random Game Picker",
		"version": "1.0.1",
		"author": "UberActivist",
		"callback": () => {
			const bot = require.main.exports.bot;
			var firstpick = random.integer(0,gameState.length-1);
			bot.setPresence({game: gameState[firstpick]});
			setInterval(() => {
				var num = random.integer(0,gameState.length-1);
				bot.setPresence({game: gameState[num]});
			},300000);
		}
	};
}