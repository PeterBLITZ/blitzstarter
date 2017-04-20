import axios from 'axios';

import { FETCH_ALL_POSTS_SUCCESS,
         FETCH_ALL_POSTS_FAIL,
         FETCH_USER_DATA_SUCCESS,
       } from '../constants/FetchData'

import { LOGIN_INIT_FAIL } from '../constants/Login'

export const fetchAllPosts = () => dispatch =>
  axios.get('/post')
    .then(res=>dispatch({
      type: FETCH_ALL_POSTS_SUCCESS,
      payload: res.data.allposts
    }))
    .catch(error=>dispatch({
      type: FETCH_ALL_POSTS_FAIL,
      error
    }))

export function fetchUserFriendsData() {
  return (dispatch) => {
    axios.get('/auth')
      .then(res => {
        console.log('FETCH_USER_DATA_SUCCESS', res);
        dispatch({
          type: FETCH_USER_DATA_SUCCESS,
          payload: res.data.user
        })
      })
      .catch(res => {
        console.log('FETCH_USER_DATA_FAIL', res);
        // localStorage.auth = false
        dispatch({
          type: LOGIN_INIT_FAIL
        })
      })
  }
}
