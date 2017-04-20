module.exports = function(app, passport) {

  require('./passport')(app, passport);
  require('./posts')(app);

  var App = require('../public/assets/server');
  app.get('*', App.default);

};
