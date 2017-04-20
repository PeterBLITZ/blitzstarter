import crypto from 'crypto';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const imP = require('../../../lib/imP');
const uploadOneImageToCacheP = require('../../../lib/uploadOneImageToCacheP');

const schema = new Schema({
  name: String,
  avatar: String,
  local: {
    email: String,
    hashedPassword: String,
    salt: String,
    name: String,
    avatar: String,
    nickName: String,
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

function uploadFromURLAndSaveAvaP(fbAvaURL) {
  if (!fbAvaURL) { return Promise.resolve('') }
  const versions = [{
    prefix: 'ava-',
    bucket: 'blitzstarter-avatars',
  }]
  return uploadOneImageToCacheP(fbAvaURL)
    .then(cacheAvaUri => imP.saveOneP(cacheAvaUri, versions))
    .then(fbAvaURLArr => `https://s3.eu-central-1.amazonaws.com/${versions[0].bucket}/${fbAvaURLArr[0]}`)
}

schema.statics.facebookAuthorize = function(req, accessToken, refreshToken, profile, done) {
  const User = this
  const fbEmail = profile.emails ? profile.emails[0].value : ''
  const fbPhoto = profile.photos ? profile.photos[0].value : ''
  return User.findOne({'facebook.id': profile.id})
    .then(oldUser => {
      if (!req.user) {
        if (oldUser) {
          oldUser.facebook.token = accessToken
          return oldUser.save()
        } else {
          return uploadFromURLAndSaveAvaP(fbPhoto)
            .then(fbAvaURL => new User({
                'name':   profile.displayName,
                'avatar': fbAvaURL,
                'facebook.id':     profile.id,
                'facebook.token':  accessToken,
                'facebook.name':   profile.displayName,
                'facebook.email':  fbEmail,
                'facebook.avatar': fbPhoto,
              }).save())
        }
      } else {
        if (oldUser) {
          return Promise.resolve({user:false, error:'Sorry, but if you want connect this account, remove old one (Facebook)'}) // ?? what to send
        } else {
          let user = req.user
          user.facebook.id     = profile.id;
          user.facebook.token  = accessToken;
          user.facebook.name   = profile.displayName;
          user.facebook.email  = fbEmail;
          user.facebook.avatar = fbPhoto;
          return user.save()
        }
      }
  })
}

schema.statics.authorizeLocal = function(req, email, password, done) {
  const User = this
  return User.findOne({'local.email': email})
    .then(oldUser => {
      if (!req.user) {
        if (oldUser) {
          if (oldUser.checkPassword(password)) {
            return Promise.resolve(oldUser)
          } else {
            return Promise.resolve({user:false, error:'Wrong pass'})
          }
        } else {
          return new User({
            'local.email':    email,
            'local.password': password
          }).save()
        }
      } else {
        if (oldUser) {
          return Promise.resolve({user: false, error:`Sorry, but if you want connect this account, remove old one (${email})`})
        } else {
          var user = req.user
          user.local.email    = email
          user.local.password = password
          return user.save()
        }
      }
  })
}

const User = mongoose.model('User', schema);

export default User;
