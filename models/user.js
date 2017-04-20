var crypto = require('crypto')
var util = require('util')
var log = require('lib/log')(module)
var request = require('request')
var mongoose = require('lib/mongoose')
var ObjectID = require('mongodb').ObjectID
var Schema = mongoose.Schema

var schema = new Schema({
  local: {
    email: String,
    hashedPassword: String,
    salt: String,
    name: String,
    avatar: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    avatar: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
})

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.local.salt).update(password).digest('hex');
};

schema.virtual('local.password')
  .set(function(password) {
    this.local._plainPassword = password;
    this.local.salt = Math.random() + '';
    this.local.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this.local._plainPassword; });

schema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.local.hashedPassword;
};

schema.statics.facebookAuthorize = function(req, accessToken, refreshToken, profile, done) {
  var User = this;
  log.info('--- P R O F I L E --- ', profile)
  var email = profile.emails ? profile.emails[0].value : ''
  User.findOne({'facebook.id': profile.id}, function(err, oldUser) {
    if (err) {return done(err); }
    if (!req.user) {
      if (oldUser) {
        done(null, oldUser);
      } else {
        var newUser = new User({
              'facebook.id': profile.id
            , 'facebook.token': accessToken
            , 'facebook.name': profile.displayName
            , 'facebook.email': email
            , 'facebook.avatar': profile.photos[0].value
        }).save(function(err, newUser){
            if(err) {return done(err); }
            done(null, newUser);
        });
      }
    } else {
      if (oldUser) {
        return done(null, false, 'Sorry, but if you want connect this account, remove old one (Facebook)');
      } else {
        var user = req.user;
        user.facebook.id = profile.id;
        user.facebook.token = accessToken;
        user.facebook.name = profile.displayName;
        user.facebook.email = profile.emails[0].value;
        user.facebook.avatar= profile.photos[0].value;
        user.save(function(err) {
            if (err) {return done(err); }
            return done(null, user);
        });
      }
    }
  });
};

schema.statics.authorize = function(req, email, password, done) {
  var User = this;
  User.findOne({'local.email': email}, function(err, oldUser) {
    if (err) {return done(err); }
    if (!req.user) {
      if (oldUser) {
        if (oldUser.checkPassword(password)) {
          done(null, oldUser);
        } else {
          done(null, false, 'Wrong pass');
        }
      } else {
        var newUser = new User({
            'local.email': email,
            'local.password': password
        }).save(function(err, newUser){
            if(err) {return done(err); }
            log.info('save new LOCAL User'.bgRed);
            done(null, newUser);
        });
      }
    } else {
      if (oldUser) {
        return done(null, false, 'Sorry, but if you want connect this account, remove old one (' + email + ')');
      } else {
        var user = req.user;
        user.local.email = email;
        user.local.password = password;
        user.save(function(err) {
            if (err) {return done(err); }
            return done(null, user);
        });
      }
    }
  });
};

exports.User = mongoose.model('User', schema);

function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);
  this.message = message;
}
util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
