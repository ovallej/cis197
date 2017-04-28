// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var User = require('./User');
var Events = require('./Events');
//var gcal = require('google-calendar');
var goog = require('googleapis');
var plus = goog.plus('v1');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var OAuth2 = goog.auth.OAuth2;

//Google AUTH/API 

//client id
var GOOGLE_CLIENT_ID = '192553099065-pv61hmu21fvb9qq03fh4u3ll19ad9pe0.apps.googleusercontent.com';
//client secret
var GOOGLE_CLIENT_SECRET = 'WB64_Q4aVrTCSA2bdoj1qfA3';
var REDIRECT_URL = "http://localhost:3000/auth/google/callback";
var oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL
);
//specify authentication
goog.options({
  auth: oauth2Client
});

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

/******** GOOGLE CALENDAR / AUTH CODE THROUGH PASSPORT ******/

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback" //'postmessage'
  },
  function(accessToken, refreshToken, profile, done) {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
        // Optional, provide an expiry_date (milliseconds since the Unix Epoch) 
        // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7) 
    });
    cal = goog.calendar('v3');
    cal.calendarList.list(function(err, calendarList) {
      console.log("IT WORKEDDADA");
    });

    done(null, profile);

  }
));

app.use(cookieSession({
  secret: 'SHHisASecret'
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  //user id?
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //user id?
  done(null, user);
});
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback

app.get('/auth/google', function (req, res, next){
  console.log(req.path);
  console.log(req.get('Referrer'));
  req.session.returnTo = req.get('Referrer');
  next();
})
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/plus.login'] }));

// app.get('/auth/google', function (req, res) {
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/plus.login'] }));
// });
// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.path);
    console.log("authenticateD");
    console.log(req.session.returnTo);
    var returnTo = req.session.returnTo;
    req.session.returnTo = null;
    res.redirect(returnTo);
  });

app.get('/test', function(req, res) {

  cal = goog.calendar('v3');
  cal.calendarList.list(function(err, calendarList) {

    var startDate = new Date(2017, 3, 17, 0, 0, 0, 0);
    var endDate = new Date(2017, 3, 24, 0, 0, 0, 0);
    relevantEvents = [];
    for (var i = 0; i < calendarList.items.length; i++) {
      console.log('calendarlist.length ' + calendarList.items.length);
      if (calendarList.items[i].accessRole === 'owner') {
        params = {
          'calendarId': calendarList.items[i].id,
          'singleEvents': true,
          'timeMin': startDate.toISOString(),
          'timeMax': endDate.toISOString()
        }
        cal.events.list(params, function(err, li) {
          console.log('li.length ' + li.items.length);
          relevantEvents = relevantEvents.concat(li.items);
          if (i === calendarList.items.length) {
            //res.json({ message: relevantEvents });
          }
          console.log("i:" + i + " relev " + relevantEvents.length);
        });
      }
    }
  });
  res.redirect('/game');


});

/********** GOOGLE CALENDAR AUTH CODE *******/
//var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/event', (req, res) => {
  console.log(req.body.dates);
  console.log(req.body.event);
  Events.addEvent(req.body.event, req.body.dates, function(err) {
    if (err) console.log(err);
    else {
      console.log('SUCCESS ADDED EVENT: ' + req.body.event);
      res.json('SUCCESS');
    }
  });
});


app.post('/updateAvailability', (req, res) => {
  var user = req.body.user;
  var availability = req.body.availability;
  var eventName = req.body.eventName;
  Events.findOne({eventName: eventName}, function(err, data) {
    console.log(data);
  });
  Events.updateAvailability(eventName,req.body.user, req.body.availability, function(){
    console.log('SUCCESS?');
  });

});

app.get('/eventData/:eventName', (req, res) => {
  console.log('event/eventname');
  console.log(req.params.eventName);
  Events.findOne({ eventName: req.params.eventName }, function(err, event) {
    console.log('REQ SESSION NAME: ' + req.session.username);
    console.log('REQ SESSION AUTH EVENTDATA: ' + req.isAuthenticated());
    var user = req.session.username ? req.session.username  : '';
    var loggedEvent = req.session.event ? req.session.event : '';

    res.json({ event: event, user: user, auth: req.isAuthenticated(), loggedEvent: loggedEvent });
  });
});

app.post('/loginForm', (req, res) => {
  var user = req.body.user;
  var pass = req.body.pass;
  var eventName = req.body.eventName;

  User.checkIfLegit(user, pass, function(err, isRight) {
    if (err) {
      res.send('Error! ' + err);
    } else {
      if (isRight) {
        console.log('ISSRIGHT CHECKED LEGIT');
        req.session.username = user;
        req.session.event = eventName;
        Events.findUser(eventName, user, function(data) {
          console.log('IN EVENT FINDUSER');
          console.log(data);
          res.json({
            data: data,
            user: user,
            event: eventName
          });
        });
      } else {
        res.status(401).json({
          message: 'Invalid Password'
        });
      }
    };
  });
});


app.post('/registerForm', (req, res) => {
  var user = req.body.user;
  var eventName = req.body.eventName;
  var pass = req.body.pass;
  console.log(user);
  console.log(eventName);
  console.log(pass);

  User.addUser(user, pass, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('SUCCESSFULLY ADDED TO USER TABLE')
    }
  });

  Events.addUser(eventName, user, function(data) {
    console.log('ADDEDDSUSUSUSUUEURUR ' + data);
    console.log('SUCCESS ADDED TO EVENT' + data);
    req.session.username = user;
    req.session.event = eventName;
    res.json({
      data: data,
      user: user,
      event: eventName
    });
  });

  
});



app.post('/data', (req, res) => {
  console.log('DATA ISAUTH ' + req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log(req.body.dates);
    var startDateArr = [];
    var endDateArr = [];
    for(var i = 0; i < req.body.dates.length; i++){
      startDateArr.push(new Date(2017, req.body.dates[i].month, req.body.dates[i].day));
      var newEndDate = new Date(2017, req.body.dates[i].month, req.body.dates[i].day);
      newEndDate.setDate(newEndDate.getDate()+1);
      endDateArr.push(newEndDate);
    }
    console.log(startDateArr);
    console.log(endDateArr);

    var cal = goog.calendar('v3');
    cal.calendarList.list(function(err, calendarList) {
      if (err || !calendarList) {
        console.log(calendarList);
        console.log(err);
        res.json({ message: "I'm just testing to see if this works NOT" });
      }

      var total = 0;
      for (var i = 0; i < calendarList.items.length; i++) {
        if (calendarList.items[i].accessRole === 'owner') {
          total++;
        }
      }
      total = total * startDateArr.length;
      var counter = 0;

      for (var d = 0; d < startDateArr.length; d++) {

        var startDate = startDateArr[d];
        var endDate = endDateArr[d];

        var relevantEvents = [];
        for (var i = 0; i < calendarList.items.length; i++) {
          if (calendarList.items[i].accessRole === 'owner') {
            params = {
              'calendarId': calendarList.items[i].id,
              'singleEvents': true,
              'timeMin': startDate.toISOString(),
              'timeMax': endDate.toISOString()
            }
            cal.events.list(params, function(err, li) {
              counter++;

              relevantEvents = relevantEvents.concat(li.items);
              if (counter == total) {
                var response = [];
                for (var j = 0; j < relevantEvents.length; j++) {
                  console.log('DAY');
                  console.log((new Date(relevantEvents[j].start.dateTime)).getDate());
                  response.push({
                    name: relevantEvents[j].summary,
                    startDay: (new Date(relevantEvents[j].start.dateTime)).getDate(),
                    startHour: (new Date(relevantEvents[j].start.dateTime)).getHours(),
                    endDay: (new Date(relevantEvents[j].end.dateTime)).getDate(),
                    endHour: (new Date(relevantEvents[j].end.dateTime)).getHours(),
                    month: (new Date(relevantEvents[j].start.dateTime)).getMonth(),
                    start: relevantEvents[j].start.dateTime,
                    end: relevantEvents[j].end.dateTime
                  })
                }
                res.json({ message: response });
              }
            });
          }
        }
      }



    });

  } else {
    res.json({ message: "I'm just testing to see if this works NOT" });
  }
});



app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', function(req, res) {
  req.session.username = '';
  req.logout();
  res.redirect(req.get('Referrer'));
});



app.get('*', (req, res) => {
  //res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  res.render(path.resolve(__dirname, '..', 'build', 'index.html'), { test: 'OMGAHH' });
});



module.exports = app;
