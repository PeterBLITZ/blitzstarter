import axios from 'axios';
import { replace, push } from 'react-router-redux';

import {
  LOGIN_INIT,
  LOGIN_INIT_SUCCESS,
  LOGOUT_SUCCESS,
  SOL,
  SOL_SUCCESS,
  SOL_FAIL,
} from '../types/Login';

import { FETCH_USER_DATA_SUCCESS } from '../types/FetchData';

const AUTH_PATH = '/auth';

export const loginReplace = (url = '/') =>
  dispatch => {
    dispatch(replace(url));
  };

export function loginInitialize() {
  return {
    type: LOGIN_INIT,
    promise: axios.get(AUTH_PATH),
  };
}

export const logout = () =>
  dispatch =>
    axios
      .post(`${AUTH_PATH}/logout`)
      .then(() =>
        dispatch({
          type: LOGOUT_SUCCESS,
        }))
      .then(() => dispatch(push('/login')));

export function SoL(email, pass) {
  return dispatch => {
    dispatch({
      type: SOL,
      payload: {
        email,
        pass,
      },
    });

    axios
      .post(`${AUTH_PATH}/sol`, {
        email,
        password: pass,
      })
      .then(res => {
        dispatch({
          type: SOL_SUCCESS,
          payload: res.data,
        });
        dispatch({
          type: LOGIN_INIT_SUCCESS,
          res,
        });
        dispatch({
          type: FETCH_USER_DATA_SUCCESS,
          payload: res.data.user,
        });
      })
      .catch(err => {
        dispatch({
          type: SOL_FAIL,
          error: err,
        });
      });
  };
}
