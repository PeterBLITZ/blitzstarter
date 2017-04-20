import { GOOD_NEWS
       } from '../constants/App'

const initialState = {};

const app = (state = initialState, action) => {
  switch (action.type) {
    case GOOD_NEWS:
      return { ...state, isGoodNews: action.payload }

    default:
      return state
  }
}

export default app
