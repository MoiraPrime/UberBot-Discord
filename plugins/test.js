module.exports = (statusReport) => {
	return {
		"name":"Test Plugin",
		"version": "0.2",
		"author": "UberActivist",
		"callback": () => {
			throw "Woops";
		}
	};
}