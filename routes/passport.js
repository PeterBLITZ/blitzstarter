var log = require('lib/log')(module);

module.exports = function(app, passport) {
  app.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ auth: true, _id: req.user._id, user: req.user });
    } else {
      res.json({ auth: false });
    }
  });

  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['user_friends', 'email'] })
  );

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/',
    }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/',
    }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.post('/sol', (req, res, next) => {
    console.log('================= SoL =================', req.body);
    passport.authenticate('local', (err, user, info) => {
      // console.log('----- err, user, info', err, user, info);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.sendStatus(404);
      }
      req.logIn(user, err => {
        console.log('----- SoL logIn ------', err, user, req.user);
        if (err) {
          return next(err);
        }
        res.json({ auth: true, _id: req.user._id, user: req.user });
      });
    })(req, res, next);
  });

  app.post('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
  });
};
