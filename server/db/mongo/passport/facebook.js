import User from '../models/user';

export default (req, accessToken, refreshToken, profile, done) => {
  User.facebookAuthorize(req, accessToken, refreshToken, profile)
    .then(user => done(null, user))
    .catch(err => done(err));
};
