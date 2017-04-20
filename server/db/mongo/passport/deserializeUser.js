import User from '../models/user';

export default (id, done) => {
  User.findById(id).then(user => done(null, user)).catch(err => done(err));
};
