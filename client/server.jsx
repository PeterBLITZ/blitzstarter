import axios from 'axios';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import UAParser from 'ua-parser-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { configureRoutes } from './routes';
import configureStore from './store/configureStore';
import preRenderMiddleware from './middlewares/preRenderMiddleware';

import muiTheme from './constants/MuiTheme';

if (__DEVSERVER__) {
  injectTapEventPlugin();
}

const clientConfig = {
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || '3000',
};
axios.defaults.baseURL = `http://${clientConfig.host}:${clientConfig.port}`;

export default function render(req, res) {
  console.log('----SSR----', req.isAuthenticated());

  axios.defaults.headers.cookie = req.headers.cookie;

  const ua = UAParser(req.headers['user-agent']);
  console.log('UA ------ ', ua.device.type);

  const authenticated = req.isAuthenticated();
  const history = createMemoryHistory();
  let store = configureStore({}, history);
  if (authenticated) {
    store = configureStore(
      {
        login: {
          auth: authenticated,
          _id: req.user._id,
        },
        user: req.user,
        app: {
          mode: ua.device.type,
        },
      },
      history
    );
  }

  const routes = configureRoutes(store);

  match({ routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      console.log('match error', err);
      res.status(500).json(err);
    } else if (redirect) {
      console.log('match redirect');
      res.redirect(302, redirect.pathname + redirect.search);
    } else if (props) {
      console.log('match props');
      preRenderMiddleware(store.dispatch, props.components, props.params)
        .then(() => {
          const initialState = store.getState();
          const componentHTML = renderToString(
            <MuiThemeProvider muiTheme={muiTheme(req)}>
              <Provider store={store}>
                <RouterContext {...props} />
              </Provider>
            </MuiThemeProvider>
          );
          console.log('initialState ---------5555555555 ', JSON.stringify(initialState));
          const noScale = ua.device.type ? ' maximum-scale=1.0, user-scalable=no' : '';
          res.status(200).send(
            `
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1${noScale}">
              <title>Devchallenge</title>
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            </head>
            <body style="margin:0">
              <div id="root">${componentHTML}</div>
              <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
              <script src="/assets/app.js"></script>
            </body>
          </html>
        `
          );
        })
        .catch(error => {
          console.log('match err2', error);
          res.status(500).json(error);
        });
    } else {
      console.log('match 404');
      res.sendStatus(404);
    }
  });
}
