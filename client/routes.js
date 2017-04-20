import React from 'react'
import { Route, IndexRedirect } from 'react-router'

import App   from './containers/App'
import Login from './containers/Login'
import Main  from './components/Main'

const configureRoutes = store => {
  const state = store.getState()
  const isAuth = state.login && state.login.auth && state.login._id

  const showNews = !!isAuth &&
      <Route path='/news' component={Main} />

  return (
    <Route path='/' component={App}>
      <IndexRedirect to={ isAuth ? '/news' : '/login' } />
      {showNews}
      <Route path='/login' component={Login} />
      <Route path='*' component={ isAuth ? Main : Login } />
    </Route>
  )
}

export { configureRoutes }
