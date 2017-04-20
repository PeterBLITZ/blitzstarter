var config = require('config');
var log = require('lib/log')(module);
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var path = require('path');
var HttpError = require('error').HttpError;
var session = require('express-session');
var mongoose = require('lib/mongoose');
var passport = require('passport');
var methodOverride = require('method-override'); // no with only ajax

var app = express();

//  for Hot Reloading
const webpackConfig = require('./webpack/webpack.config.dev-client');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
if (config.get('NODE_ENV') === 'development') {
  log.info('NODE_ENV === development');
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath })
  );
  app.use(webpackHotMiddleware(compiler));
}

require('lib/passport')(passport, config);

log.stream = {
  write(message, encoding) {
    log.info(message);
  },
};
app.use(require('morgan')('dev', { stream: log.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

var MongoStore = require('connect-mongo')(session);
app.use(
  session({
    secret: config.get('session:secret'),
    name: config.get('session:name'),
    cookie: config.get('session:cookie'),
    resave: false, // research
    saveUninitialized: true, // research + passport
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(require('middleware/sendHttpError'));

app.use(express.static(path.join(__dirname, 'public')));

require('routes')(app, passport);

var server = app.listen(config.get('port'), () => {
  var host = server.address().address;
  var port = server.address().port;

  log.info('server listening at http://%s:%s', host, port);
});
