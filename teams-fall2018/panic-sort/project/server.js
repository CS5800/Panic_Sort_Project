const http = require('http');
const fs = require('fs');
const formidable = require('formidable');

const express = require('express');
const app = express();

var keys = require('./config/keys')
var cookieParser = require('cookie-parser');
const { google } = require('googleapis');



//const ocr = require('./OCRText');

//var urlencodedParser = bodyParser.urlencoded({ extended: true });

var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.set('view engine', 'ejs');


passport.use(new GoogleStrategy({
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: "http://sillibus.xyz/auth/google/redirect",
  scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
},
  function (accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    return done(null, profile);
  }
));


app.get('/', function (req, res) {
  res.render('homepage');
});
////////////////////////////////////////////////////////////////////////


app.post('/form/upload/ical', function (req, res) {
  const currentPath = process.cwd();
  let pruned;
  let oldpath;
  let newpath;
  let field;
  a(() => b(newpath, field));


  function a(callback) {

    let timeStamp = new Date() / 1000;


    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      field = fields;
      oldpath = files.filetoupload.path;
      newpath = currentPath + '/uploads/' + timeStamp + files.filetoupload.name;

      fs.renameSync(oldpath, newpath, function (err) {
        if (err) throw err;
      });




      callback();
    });

  }
  function b(newpath, fields) {

    let ocr = require('./OCRText');
    let ics = require('./ICS');


    ocr.extract(newpath, fields.parseType)
      .then(function (pruned) {
        ics.createCal(newpath, pruned);
        res.download(newpath + '.ics');
      })
      .catch(err => res.send(err));

  }

});

app.get('/form', (req, res) => {
  res.render('form');
});

app.get('/form/ical', (req, res) => {
  res.render('icalForm')
});
////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/auth',
  passport.authenticate('google', { session: false }));

app.get('/auth/google/redirect',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  function (req, res) {
    //req.session.access_token = req.user.accessToken;
    console.log(req.user.accessToken);
    console.log(req.user);
    res.cookie('sillibus', req.user.accessToken);
    res.redirect('/form');
  });

///////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/upload/google', function (req, res) {
  const currentPath = process.cwd();

  let oldpath;
  let newpath;
  let field;
  a(() => b(newpath, field));



  function a(callback) {

    let timeStamp = new Date() / 1000;


    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      field = fields;
      oldpath = files.filetoupload.path;
      newpath = currentPath + '/uploads/' + timeStamp + files.filetoupload.name;

      fs.renameSync(oldpath, newpath, function (err) {
        if (err) throw err;
      });


      callback();
    });

  }
  function b(newpath, fields) {

    let ocr = require('./OCRText');


    ocr.extract(newpath, fields.parseType)
      .then(function (pruned) {

        credentials = { 'access_token': req.cookies.sillibus };
        var oauth2Client = new google.auth.OAuth2(keys.google.clientId, keys.google.clientSecret, "http://sillibus.xyz/auth/google/redirect");
        oauth2Client.credentials = credentials;

        res.clearCookie();
        const calendar = google.calendar({ version: 'v3', oauth2Client });
        lines = pruned.lines;
        dates = pruned.dates;
        tags = pruned.tags;

        console.log('here                   :');
        console.log(lines);
        console.log(lines.length);
        console.log('here                   :');
        eventStack = [];

        for (i = 0; i < lines.length; i++) {
          console.log(i);
          description = lines[i];
          summary = 'Due: ' + tags[i];
          month = dates[i][0];
          day = dates[i][1];
          year = dates[i][2];
          startDateTime = year + '-' + month + '-' + day + 'T01:00:00-07:00';
          endDateTime = year + '-' + month + '-' + day + 'T02:00:00-07:00';

          var event = {
            'summary': summary,
            'location': '',
            'description': description,
            'start': {
              'dateTime': startDateTime
            },
            'end': {
              'dateTime': endDateTime
            },
            'recurrence': [
            ],
            'attendees': [
            ],
            'reminders': {
              'useDefault': false,
              'overrides': [
                { 'method': 'email', 'minutes': 24 * 60 },
                { 'method': 'popup', 'minutes': 24 * 60 },
              ],
            },
          };

          eventStack.push(event);
        }
        console.log(eventStack);




        //TODO:  batch call 


        for (i = 0; i < eventStack.length; i++) {
          console.log('second loop: ' + i);
          insertCall(eventStack[i],1);
        }
        function insertCall(event, backoffTime) {
          console.log('backoff Time: ' + backoffTime);
          
          calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            resource: event,
          }, function (err) {
            if (err) {
              console.log('There was an error contacting the Calendar service: ' + err);
              console.log();
              console.log();
              console.log();
              console.log(event);
              console.log();
              console.log();
              console.log();
              console.log();
              backoff(backoffTime);
              if (backoffTime < 16) {
                insertCall(event, backoffTime * 2);
              }
            }
            console.log('Event created: %s', event.description);
            return;
          });
        }


        function backoff(time) {
          let milliseconds = time * 1000;
          let start = (new Date()).getTime();
          while (((new Date()).getTime() - start) < milliseconds) {
            // do nothing
          }
        }

      }).then(() => { res.render('thanks') })
      .catch(err => res.send(err));


  }

});

app.listen(8080);












