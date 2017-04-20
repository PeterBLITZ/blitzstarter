import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from '../../../config';
import unsupportedMessage from '../../db/unsupportedMessage';
import { passport as dbPassport } from '../../db';

export default (passport) => {
  if (!dbPassport || !dbPassport.facebook || !typeof dbPassport.facebook === 'function') {
    console.warn(unsupportedMessage('passport-facebook'));
    return;
  }

  passport.use(new FacebookStrategy({
    clientID: config.get('facebook:FACEBOOK_APP_ID'),
    clientSecret: config.get('facebook:FACEBOOK_APP_SECRET'),
    callbackURL: config.get('facebook:FACEBOOK_CALLBACK_URL'),
    profileFields: ['id', 'displayName', 'photos', 'email', 'friends'],
    passReqToCallback: true,
  }, dbPassport.facebook));
};
