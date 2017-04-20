import { FETCH_USER_DATA_SUCCESS
       } from '../constants/FetchData'

const initialState = [];

const user = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_DATA_SUCCESS:
      return { ...state, ...action.payload }

    default:
      return state
  }
}

export default user
