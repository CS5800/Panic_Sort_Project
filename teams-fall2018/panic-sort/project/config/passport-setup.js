const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    // Write a logic to find this particular user from the json data using userID


    // If not found return done({});

    // else return done(null, userObject);
});


passport.use(
    new GoogleStrategy( {
        //options for strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }
    , (accessToken, refreshToken, profile, done) => {
        //passport callback function
        console.log('passport callback fired');
        //console.log(profile);
        console.log(profile.id);
        console.log('begin experiment');
        user = new User({
            accToken: accessToken,
            googleId: profile.id
        });
        profile.accessToken = accessToken;
        return done(null, user);
       
    }
)
);

