var stressTest = false;

module.exports = (statusReport) => {
	return {
		"name": "TF2 Matchmaking Stress Test Checker",
		"version": "0.2.1",
		"author": "UberActivist",
		"stressTest": stressTest,
		"callback": () => {
			const api = require.main.exports.api,
				bot = require.main.exports.bot;
			//Initial check
			api.get("ITFSystem_440","GetWorldStatus","1", (err, response) => {
				if (err) {
					statusReport("Error with initial Stress test check: " + err.message);
					return;
				}
				if (response.result.beta_stress_test_event_active && !stressTest) {
					stressTest = true;
					bot.sendMessage({to:"158357071815901184", message:"**ALERT:** The TF2 Competitive Stress Test is **ACTIVE**"});
					return;
				}
			});
				
			setInterval(function () {
				api.get("ITFSystem_440","GetWorldStatus","1",(err, response) => {
					if (err) {
						statusReport("Error with Stress test checker: " + err.message);
						return;
					}
					if (response.result.beta_stress_test_event_active && !stressTest) {
						stressTest = true;
						bot.sendMessage({to:"158357071815901184", message:"**ALERT:** The TF2 Competitive Stress Test is **ACTIVE**"});
						return;
					}
					if (!response.result.beta_stress_test_event_active && stressTest) {
						stressTest = false;
						bot.sendMessage({to:"158357071815901184", message:"**ALERT:** The TF2 Competitive Stress Test has ended."});
						return;
					}
				});
			},60000);
		}
	};
}