const path = require("path")

module.exports.load = function loadEnvironmentVariables() {
	let envfile = process.env.NODE_ENV;

	if (envfile === undefined) {
		console.log("You need to set the NODE_ENV variable to run this program.");
		console.log("Rename the /env/default.env file to match your NODE_ENV variable, and fill in missing api keys");
		return false;
	}

	require("dotenv").config({
		path: path.resolve(__dirname, `../env/${envfile}.env`)
	});

	return true;
}

module.exports.validate = function validateEnvironmentVariables() {
	let requiredEnv = ["CLIENTID", "CLIENTSECRET", "CALLBACKURL"];

	// Tests all requiredEnv vars if they are empty and if they are longer than 0 length
	let unsetEnv = requiredEnv.filter((env) => !(process.env[env] !== ""));
	if (unsetEnv.length > 0) {
  		console.log("Required ENV variables are not set: [" + unsetEnv.join(", ") + "]");
  		return false;
	}

	return true;
}
