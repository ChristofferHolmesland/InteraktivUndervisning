const express = require('express');
const path = require('path');
const history = require("connect-history-api-fallback");
const passport = require("passport");
const compression = require("compression");
const OICStrategy = require("passport-openid-connect").Strategy;
const cookieParser = require("cookie-parser");

const user = (require("./js/user.js")).User;
const users = new Map();

const dbFunctions = require("./js/database/databaseFunctions").dbFunctions;

// Imports and checks environment variables
const env = require('./js/environment.js');
if (!env.load()) { process.exit(1); }
if (!env.validate()) { process.exit(1); }

var admins = [];
if (process.env.ADMINS.length > 0) admins = process.env.ADMINS.split(",");

const app = express();
const port = process.env.PORT || 8081;

// Setup dataporten
var oic = new OICStrategy({
	"issuerHost": "https://auth.dataporten.no/",
	"client_id": process.env.CLIENTID,
	"client_secret": process.env.CLIENTSECRET,
	"redirect_uri": process.env.CALLBACKURL,
	"scope": "longterm openid profile userid-feide"
});
passport.use(oic)
passport.serializeUser(OICStrategy.serializeUser)
passport.deserializeUser(OICStrategy.deserializeUser)

// Midleware
app.use(history({
	rewrites: [
		{
			from: '/login/feide', to: '/login/feide',
			from: '/login/callback/feide', to: '/login/callback/feide'
		}
	]
})); // IMPORTANT: This line has to come before app.use(express.static())
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, '/public/')));

// Database
let db = undefined;

if (process.env.NODE_ENV === "dev") {
	//require('./js/database/database').deleteDB();
}

require('./js/database/database').getDB().then(function(value) {
	db = value;

	/*if (process.env.NODE_ENV === "dev"){
		const dummydata = require('./tools/insertDummyData');
		dummydata.InsertData(db).catch(function(err) {
			console.error(err);
			process.exit(1);
		});
	}*/

	// Starts the server and the socket.io websocket
	const server = app.listen(port, function() {
		console.info(`Server listening on localhost:${ port }! Use ctrl + c to stop the server!`);
	});
	require('./js/socketIO/generalFunctions').listen(server, users, db);
}).catch(function (err) {
	console.error(err);
	process.exit(1);
});

app.post('/login/feide', passport.authenticate('passport-openid-connect', {"successReturnToOrRedirect": "/client"}))
app.get('/login/callback/feide', passport.authenticate('passport-openid-connect', {callback: true}), function(req, res) {
	// Reads information from the scope request to feide
	let accessToken = req.user.token.access_token;

	// Only uses first and last name, no middle names or multiple last names
	let userName = req.user.data.name;
	userName = userName.split(" ");
	userName = userName[0].concat(" ", userName[userName.length - 1]);

	let userId = req.user.token.id_token;

	let temp = req.user.data["connect-userid_sec"][0];
	temp = temp.split("@");
	temp = temp[0].split(":");
	let idNumber = temp[1];
	let admin = 2;
	if (admins.indexOf(idNumber) > -1) admin = 4;
	
	dbFunctions.get.userRightByFeideId(db, idNumber).then((rows) => {
		for (let i = 0; i < rows.length; i++) {
			if (rows[i].level > admin) admin = rows[i].level;
			if (admin === 4) break;
		}
		
		// Makes a new active user
		let sessionId = user.generateSessionId();
		let tempUser = new user(admin, userName, sessionId, {
			"accessToken": accessToken,
			"userId": userId,
			"idNumber": idNumber
		});

		dbFunctions.get.userIdByFeideId(db, idNumber).then((id) => {
			if (id === undefined) {
				dbFunctions.transaction.newFeideUser(db, {
					id: idNumber,
					access: accessToken,
					name: userName,
					sessionToken: sessionId,
					admin: admin,
					userId: userId,
				}).catch((err) => {
					console.error(err);
				});
			}else {
				dbFunctions.update.feideSessionId(db, idNumber, sessionId);
			}
			users.set(sessionId, tempUser);

			// Stores a new cooikie with a random generated userid
			let cookieOptions = {
				maxAge: 1000 * 60 * 60 * 24, // cookie expires after 1 day
			}
			res.cookie("sessionId", sessionId, cookieOptions).redirect("/client");
		}).catch((err) => {
			console.error(err)
		});
	}).catch((err) => {
		console.error(err);
	});
});
