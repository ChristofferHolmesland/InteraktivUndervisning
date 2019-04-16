// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

//webpack import
//const webpack = require("@cypress/webpack-preprocessor");
//TODO somehow install @vue/cli-service to devdependencies, if possible!
module.exports = (on, config) => {
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config

	/*on("file:preprocessor", webpack({
		webpackOptions: require("@vue/cli-service/webpack.config"),
		watchOptions: {}
	})
	);*/

	return Object.assign({},config, {
		fixturesFolder: "server/tests/cypress/fixtures",
		integrationFolder: "server/tests/cypress/specs",
		screenshotsFolder: "server/tests/cypress/screenshots",
		videosFolder: "server/tests/cypress/videos",
		supportFile: "server/tests/cypress/support/index.js"
	})
};
