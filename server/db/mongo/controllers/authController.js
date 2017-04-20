import passport from 'passport';
import logger from '../../../lib/logger';

const log = logger(__filename);

export const auth = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      auth: true,
      _id: req.user._id,
      user: req.user,
    });
  } else {
    res.status(200).json({ auth: false });
  }
};

export const facebook = passport.authenticate('facebook', { scope: ['user_friends', 'email'] });

export const facebookCallback = [
  passport.authenticate('facebook', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  },
];

export const login = [
  passport.authenticate('local', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  },
];

export const sol = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      log.error(err);
      return res.status(422);
    }
    if (!user) {
      return res.status(422).json(info);
    }
    return req.logIn(user, error => {
      if (error) {
        log.error(error);
        return res.status(422);
      }
      return res.json({
        auth: true,
        _id: req.user._id,
        user: req.user,
      });
    });
  })(req, res);
};

export const logout = (req, res) => {
  req.logout();
  res.sendStatus(200);
};

export default {
  auth,
  facebook,
  facebookCallback,
  login,
  sol,
  logout,
};
