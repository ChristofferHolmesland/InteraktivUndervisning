const path = require('path');
const nunjucks = require('nunjucks');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Configures express to use nunjucks as template engine
nunjucks.configure(__dirname, { autoescape: true, express: app });

// Tells express to look in the static folder for static resources
app.use(express.static(__dirname, + '/static'));

// Parses JSON data and puts it in the req object.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.send('Hello world!');
});

app.get('/client', function(req, res) {
    res.render("client/start.njk");
});

app.listen(80, () => console.log('App started'));