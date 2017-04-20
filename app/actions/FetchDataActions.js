import axios from 'axios';

import {
  FETCH_ALL_POSTS_SUCCESS,
  FETCH_ALL_POSTS_FAIL,
} from '../types/FetchData';

const API_PATH = '/api/v0';

export const fetchAllPosts = () =>
  dispatch =>
    axios
      .get(`${API_PATH}/post`)
      .then(res =>
        dispatch({
          type: FETCH_ALL_POSTS_SUCCESS,
          payload: res.data.allposts,
        }))
      .catch(error =>
        dispatch({
          type: FETCH_ALL_POSTS_FAIL,
          error,
        }));
