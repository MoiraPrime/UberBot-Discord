/* This is a sample plugin for UberBot.
	For your plugin to be used, it must not be of mallicious intent, and it must
	use nothing other than discord.io, google, request, or random-js. You may
	also use the default modules that come with node.js. Others may be added by
	request. mysql may also used by request.

	I would also prefer that plugins not include any code to respond to commands,
	which would be better suited for a command than this.



statusReport is a function that can be used to echo text to the console and the
	console channel.
		ex.  statusReport("Hi there!");
*/


module.exports = (statusReport) => {
	return {
		"name": "Sample Plugin", //The name of your plugin. Required
		"version": "0.0.2", //The version of your plugin. Required.
		"author": "UberActivist",
		"disabled": true, //Your name. Required.
		"callback": () => { //Your Code
			const bot = require.main.exports.bot; //Links to the bot. Required for manipulating the bot.
			/*
			A useful command is bot.sendMessage({to: "channel id goes here", message: "message here"});

			You may also use events to trigger actions. A list of events and
			their actions can be found at https://github.com/izy521/discord.io/wiki

			All plugins that send a message based on an outside source must only
			send messages to #news, which has a channel ID of "158357071815901184".
			*/
			statusReport("The Sample Plugin Ran!");
		}
	};
}
