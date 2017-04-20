import express from 'express';
import { isDebug } from '../config/app';
import { connect } from './db';
import initPassport from './init/passport';
import initExpress from './init/express';
import initRoutes from './routes';
import renderMiddleware from './render/middleware';

const app = express();

// enable webpack hot module replacement
if (isDebug) {
  /* eslint-disable global-require */
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack/webpack.config');
  /* eslint-enable global-require */
  const devBrowserConfig = webpackConfig('browser');
  const compiler = webpack(devBrowserConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: devBrowserConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

connect();

initPassport();
initExpress(app);
initRoutes(app);

app.get('*', renderMiddleware);

app.listen(app.get('port'));
