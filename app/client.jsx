import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './store/configureStore';
import createRoutes from './routes';

import fetchDataForRoute from './utils/fetchDataForRoute'

import removeFacebookAppendedHash from './utils/removeFacebookAppendedHash';

// import './scss/index.scss';

injectTapEventPlugin();

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

function onUpdate() {
  if (window.__INITIAL_STATE__ !== null) {
    window.__INITIAL_STATE__ = null;
    return;
  }

  const fetchAction = fetchDataForRoute(this.state)
  return fetchAction && store.dispatch(fetchAction)
}

render(
  <Provider store={store}>
    <Router history={history} onUpdate={onUpdate} routes={createRoutes(store)} />
  </Provider>,
  document.getElementById('app')
);

removeFacebookAppendedHash();
