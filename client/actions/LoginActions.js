import axios from 'axios';
import { replace, push } from 'react-router-redux'

import {
         //  LOGIN_INIT,
         LOGIN_INIT_SUCCESS,
         //  LOGIN_INIT_FAIL,
         LOGIN_INIT_FAILURE,
         //  LOGOUT,
         LOGOUT_SUCCESS,
         SEND_AUTH,
         SEND_AUTH_SUCCESS,
         SEND_AUTH_FAIL,
         SOL,
         SOL_SUCCESS,
         SOL_FAIL,
       } from '../constants/Login'

import { FETCH_USER_DATA_SUCCESS
       } from '../constants/FetchData'


 export function sendAuth(email, pass) {
   return (dispatch) => {
     dispatch({
       type: SEND_AUTH,
       payload: {
         email: email,
         pass: pass,
       }
     })

     let data = new FormData()
     data.append( 'email',  email )
     data.append( 'password', pass )

     axios.post('/login', data)
     .then((res) => {
       console.log('SEND_AUTH_SUCCESS', res);
       dispatch({
         type: SEND_AUTH_SUCCESS,
       })
     })
     .catch(err => {
       console.log('SEND_AUTH_FAIL', err)
       dispatch({
         type: SEND_AUTH_FAIL
       })
     })

   }
 }

export function loginReplace() {
  return (dispatch) => {
    dispatch(replace('/news'))
  }
}
// export function loginInitialize() {
//   return (dispatch) => {
//     dispatch({
//       type: LOGIN_INIT
//     })
//     axios.get('/auth')
//       .then(res => {
//         console.log('LOGIN_INIT_SUCCESS', res);
//         dispatch({
//           type: LOGIN_INIT_SUCCESS,
//           payload: {
//             auth: res.data.auth,
//             _id: res.data._id
//           }
//         })
//         dispatch({
//           type: FETCH_USER_DATA_SUCCESS,
//           payload: res.data.user
//         })
//         if (res.data.auth) {
//           // localStorage.auth = true
//         } else {
//           dispatch(replace('/login'))
//         }
//       })
//       .catch(res => {
//         console.log('LOGIN_INIT_FAIL', res);
//         // localStorage.auth = false
//         dispatch({
//           type: LOGIN_INIT_FAIL
//         })
//       })
//   }
// }

export const loginInitialize = () => dispatch =>
  axios.get('/auth')
    .then(res=>dispatch({
      type: LOGIN_INIT_SUCCESS,
      res
    }))
    .catch(error=>dispatch({
      type: LOGIN_INIT_FAILURE,
      error
    }))

export const logout = () => dispatch =>
  axios.post('/logout')
    .then(() => dispatch({
      type: LOGOUT_SUCCESS
    }))
    .then(() => dispatch(push('/login')))

export function SoL(email, pass) {
  return (dispatch) => {
    dispatch({
      type: SOL,
      payload: {
        email: email,
        pass: pass,
      }
    })

    axios.post('/sol', {
        email: email,
        password: pass
      })
      .then(res => {
        dispatch({
          type: SOL_SUCCESS,
          payload: res.data
        })
        dispatch({
          type: LOGIN_INIT_SUCCESS,
          res
          // payload: {
          //   auth: res.data.auth,
          //   _id: res.data._id
          // }
        })
        dispatch({
          type: FETCH_USER_DATA_SUCCESS,
          payload: res.data.user
        })
        if (res.data.auth) {
          // localStorage.auth = true
          // dispatch(replace('/news'))
        } else {
          dispatch(replace('/login'))
        }
      })
      .catch(err => {
        dispatch({
          type: SOL_FAIL,
          error: err
        })
      })
  }
}
