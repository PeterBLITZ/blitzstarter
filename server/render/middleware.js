import axios from 'axios';
import { createMemoryHistory, match } from 'react-router';

import uaParser from 'ua-parser-js';

import createRoutes from '../../app/routes';
import configureStore from '../../app/store/configureStore';
import { baseURL } from '../../config/app';
import pageRenderer from './pageRenderer';
import fetchDataForRoute from '../../app/utils/fetchDataForRoute';

// configure baseURL for axios requests (for serverside API calls)
axios.defaults.baseURL = baseURL;

/*
 * Export render function to be used in server/config/routes.js
 * We grab the state passed in from the server and the req object from Express/Koa
 * and pass it into the Router.run function.
 */
export default function render(req, res) {

  // global.navigator = global.navigator || {};
  // global.navigator.userAgent = req.headers['user-agent'] || 'all';

  axios.defaults.headers.cookie = req.headers.cookie;
  const ua = uaParser(req.headers['user-agent']);

  const authenticated = req.isAuthenticated();
  const history = createMemoryHistory();

  const store = authenticated
  ? configureStore({
      login: {
        auth: authenticated,
        _id: req.user._id,
      },
      user: req.user,
      app: {
        mode: ua.device.type,
        ua: req.headers['user-agent'],
      },
    }, history)
  : configureStore({
      app: {
        mode: ua.device.type,
        ua: req.headers['user-agent'],
      },
    }, history)

  const routes = createRoutes(store);

  /*
   * From the react-router docs:
   *
   * This function is to be used for server-side rendering. It matches a set of routes to
   * a location, without rendering, and calls a callback(err, redirect, props)
   * when it's done.
   *
   * The function will create a `history` for you, passing additional `options` to create it.
   * These options can include `basename` to control the base name for URLs, as well as the pair
   * of `parseQueryString` and `stringifyQuery` to control query string parsing and serializing.
   * You can also pass in an already instantiated `history` object, which can be constructed
   * however you like.
   *
   * The three arguments to the callback function you pass to `match` are:
   * - err:       A javascript Error object if an error occurred, `undefined` otherwise.
   * - redirect:  A `Location` object if the route is a redirect, `undefined` otherwise
   * - props:     The props you should pass to the routing context if the route matched,
   *              `undefined` otherwise.
   * If all three parameters are `undefined`, this means that there was no route found matching the
   * given location.
   */
  match({routes, location: req.url}, (err, redirect, props) => {
    if (err) {
      res.status(500).json(err);
    } else if (redirect) {
      res.redirect(302, redirect.pathname + redirect.search);
    } else if (props) {
      // This method waits for all render component
      // promises to resolve before returning to browser

      const fetchAction = fetchDataForRoute(props)
      const fetchPromise = fetchAction && store.dispatch(fetchAction)

      Promise.all([fetchPromise])
        .then(() => {
          const html = pageRenderer(store, props);
          res.status(200).send(html);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json(error);
        });
    } else {
      res.sendStatus(404);
    }
  });
}
