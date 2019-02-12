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
if(!env.load()) { return; }
if(!env.validate()) { return; }

const fs = require("fs");
const https = require("https");

var options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
};

const app = express();
const port = 8081;

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
    require('./js/database/database').deleteDB();
}

app.get("/", function(req, res) {
    console.log("hei");
    res.send("hei");
});

require('./js/database/database').getDB().then(function(value) {
    db = value;

    if (process.env.NODE_ENV === "dev"){
        const dummydata = require('./tools/insertDummyData');
        dummydata.InsertData(db).catch(function(err) {
            console.log(err);
            process.exit(1);
        });
    }
    // Starts the server and the socket.io websocket
    const server = https.createServer(options, app);
    server.listen(port, function() {
        console.log(`Server listening on localhost:${ port }! Use ctrl + c to stop the server!`)
    });
    require('./js/socketIO/generalFunctions').listen(server, users, db);
}).catch(function (err) {
    console.log(err);
    process.exit(1);
});

app.post('/login/feide', passport.authenticate('passport-openid-connect', {"successReturnToOrRedirect": "/client"}))
app.get('/login/callback/feide', passport.authenticate('passport-openid-connect', {callback: true}), function(req, res) {

    // Reads information from the scope request to feide
    let accessToken = req.user.token.access_token;
    let userRights = 2; //TODO write function to check database for the userRight
    let userName = req.user.data.name;
    let userId = req.user.token.id_token;

    let temp = req.user.data["connect-userid_sec"][0];
    temp = temp.split("@");
    temp = temp[0].split(":");
    let idNumber = temp[1];

    // Add Christoffer as admin
    if (idNumber == "239416" || idNumber == "228288") {
        userRights = 4;
    }

    // Makes a new active user
    let tempKey = user.generateSessionId();
    let tempUser = new user(userRights, userName, tempKey, {
        "accessToken": accessToken,
        "userId": userId,
        "idNumber": idNumber
    });

    dbFunctions.get.userIdByFeideId(db, idNumber).then((id) => {
        if (id === undefined) {
            dbFunctions.insert.feide(db, idNumber, accessToken, userName).then(() => {
                dbFunctions.insert.feideUser(db, userId, idNumber).catch((err) => {
                    console.log(err)
                });
            }).catch((err) => {
                console.log(err);
            })
        }

        users.set(tempKey, tempUser);

        // Stores a new cooikie with a random generated userid
        res.cookie("sessionId", tempKey, {expires: new Date(Date.now + 500/*2678400000*/)}).redirect("/client");
    }).catch(() => {

    });
});
