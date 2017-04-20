import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import { loginInitialize, fetchAllPosts } from './fetch-data'
import { App, News, LoginOrRegister } from './pages';

const createRoutes = store => {

  const requireAuth = (nextState, replace, callback) => {
  const { login: { auth }} = store.getState()
  if (!auth) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
  callback()
}

const redirectAuth = (nextState, replace, callback) => {
  const { login: { auth }} = store.getState()
  if (auth) {
    replace({
      pathname: '/news',
    });
  }
  callback()
}

  const state = store.getState();
  const isAuth = state.login && state.login.auth && state.login._id;

  return (
    <Route path='/' component={App} fetchData={loginInitialize} >
      <IndexRedirect to={isAuth ? '/news' : '/login'} />
      <Route path='/news' component={News} onEnter={requireAuth} fetchData={fetchAllPosts} />
      <Route path='/login' component={LoginOrRegister} onEnter={redirectAuth} />
      <Route path='*' component={isAuth ? News : LoginOrRegister} />
    </Route>
  );
};

export default createRoutes;
