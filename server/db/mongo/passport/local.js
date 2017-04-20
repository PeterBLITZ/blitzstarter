import User from '../models/user';

export default (req, email, password, done) => {
  User.authorizeLocal(req, email, password)
    .then(user => {
      if (user.error) return done(null, false, user.error);
      return done(null, user);
    })
    .catch(err => done(err));
}
