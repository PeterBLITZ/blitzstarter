import { LOGIN_INIT_SUCCESS, LOGIN_INIT_FAILURE, LOGOUT_SUCCESS } from '../types/Login';

const initialState = {
  auth: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_INIT_SUCCESS:
      return { ...state, auth: action.res.data.auth, _id: action.res.data._id };

    case LOGIN_INIT_FAILURE:
    case LOGOUT_SUCCESS:
      return { ...initialState };

    default:
      return state;
  }
};

export default login;
