const express = require('express');
const path = require('path');
const history = require("connect-history-api-fallback");
const passport = require("passport");
const OICStrategy = require("passport-openid-connect").Strategy;
const cookieParser = require("cookie-parser");

// Imports and checks environment variables
const env = require('./tools/environment.js');
if (!env.load()) { return; };
if (!env.validate()) { return; };

const app = express();
const port = 3000;

// Setup dataporten
var oic = new OICStrategy({
    "issuerHost": "https://auth.dataporten.no/",
    "client_id": "e4de58d1-c318-43ec-9ccc-5ad63cdda550",
    "client_secret": "87370fb0-219c-48e9-b07f-a12d5943be56",
    "redirect_uri": "http://localhost:3000/login/callback/feide",
    "scope": "longterm openid profile"
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
app.use(express.static(path.join(__dirname, '/public/')));

// Starts the server and the socket.io websocket
const server = app.listen(port, function() {
    console.log(`Server listening on localhost:${ port }! Use ctrl + c to stop the server!`)
});
const io = require('./iofunctions').listen(server);

app.post('/login/feide', passport.authenticate('passport-openid-connect', {"successReturnToOrRedirect": "/client"}))
app.get('/login/callback/feide', passport.authenticate('passport-openid-connect', {callback: true}), function(req, res) {
    res.cookie("test", req.user.data.name).redirect("/client");
});
