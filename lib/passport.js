var User = require('models/user').User;
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var log = require('lib/log')(module);
var util = require('util');

module.exports = function(passport, config) {
  passport.serializeUser((user, done) => {
    log.info('serializeUser '.red + user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    log.info(id.red);
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          User.authorize(req, email, password, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            return done(null, user);
          });
        });
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: config.get('facebook:FACEBOOK_APP_ID'),
        clientSecret: config.get('facebook:FACEBOOK_APP_SECRET'),
        callbackURL: `${config.get('facebook:FACEBOOK_CALLBACK_URL')}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email', 'friends'],
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.facebookAuthorize(req, accessToken, refreshToken, profile, (err, user, msg) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: msg });
            return done(null, user);
          });
        });
      }
    )
  );
};
