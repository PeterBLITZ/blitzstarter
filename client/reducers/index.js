import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import posts from './posts'
import addpost from './addpost'
import user from './user'
import login from './login'
import app from './app'

const AppReducers = combineReducers({
  login,
  posts,
  addpost,
  user,
  app,
  routing
})

export default AppReducers
