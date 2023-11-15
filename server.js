// server.js
// https://github.com/leonnoel/savage-auth
// port 4040

// set up ======================================================================
// get all the tools we need
// If it says require they're all modules
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 4040;
const MongoClient = require('mongodb').MongoClient // help talk to db
var mongoose = require('mongoose'); // how we really talk to db
var passport = require('passport'); // authentication
var flash    = require('connect-flash'); // error messages

var morgan       = require('morgan'); // how we log in terminal, helpful for debugging and building
var cookieParser = require('cookie-parser'); // enable us to look at logged in sessions, user can leave computer and come back by cookies
var bodyParser   = require('body-parser'); // comes along with form submission, also built into express so it's deprecated
var session      = require('express-session');

var configDB = require('./config/database.js'); // same as configDB it is holding that object

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db); // (app,passport,db) is our function callbacks/ arguements
  // grabbing module routes js ./app
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')) // setting up public file so that you don't have to write "if you put something in public folder, it is now served up, you don't need to write individual lines for it"


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret - can be anything u want as long as it's not empty
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port); 
console.log('Connected! The magic happens on port ' + port);
