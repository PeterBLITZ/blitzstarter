import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import promiseMiddleware from '../middlewares/promiseMiddleware';
import { isClient, isDebug } from '../../config/app';

export default function configureStore(initialState, history) {
  const middleware = [thunk, promiseMiddleware, routerMiddleware(history)];
  let store;

  if (isClient && isDebug) {
    middleware.push(createLogger());
    store = createStore(
      rootReducer,
      initialState,
      compose(
        applyMiddleware(...middleware),
        typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
          ? window.devToolsExtension()
          : f => f
      )
    );
  } else {
    store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleware), f => f));
  }

  // Hot Reload
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers'); // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
