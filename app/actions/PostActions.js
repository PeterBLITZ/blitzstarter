import axios from 'axios';

import {
  ADD_LIKE,
  ADD_LIKE_SUCCESS,
  ADD_LIKE_FAIL,
  ADD_DISLIKE,
  ADD_DISLIKE_SUCCESS,
  ADD_DISLIKE_FAIL,
} from '../types/Post';

const API_PATH = '/api/v0';

export function addLike(_id, userId) {
  return dispatch => {
    dispatch({
      type: ADD_LIKE,
      payload: {
        _id,
        userId,
      },
    });

    axios
      .post(`${API_PATH}/post/${_id}/like`)
      .then(res => {
        dispatch({
          type: ADD_LIKE_SUCCESS,
          payload: res,
        });
      })
      .catch(err => {
        dispatch({
          type: ADD_LIKE_FAIL,
          error: err,
        });
      });
  };
}

export function addDislike(_id, userId) {
  return dispatch => {
    dispatch({
      type: ADD_DISLIKE,
      payload: {
        _id,
        userId,
      },
    });

    axios
      .post(`${API_PATH}/post/${_id}/dislike`)
      .then(res => {
        dispatch({
          type: ADD_DISLIKE_SUCCESS,
          payload: res,
        });
      })
      .catch(err => {
        dispatch({
          type: ADD_DISLIKE_FAIL,
          error: err,
        });
      });
  };
}
