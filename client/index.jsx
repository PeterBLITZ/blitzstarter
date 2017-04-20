import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from './constants/MuiTheme';

import configureStore from './store/configureStore';
import { configureRoutes } from './routes';

import preRenderMiddleware from './middlewares/preRenderMiddleware';

import removeFacebookAppendedHash from './utils/removeFacebookAppendedHash';

import './scss/index.scss';

injectTapEventPlugin();

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

function onUpdate() {
  if (window.__INITIAL_STATE__ !== null) {
    window.__INITIAL_STATE__ = null;
    return;
  }
  const { components, params } = this.state;
  preRenderMiddleware(store.dispatch, components, params);
}

render(
  <MuiThemeProvider muiTheme={muiTheme()}>
    <Provider store={store}>
      <Router history={history} onUpdate={onUpdate} routes={configureRoutes(store)} />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

removeFacebookAppendedHash();
