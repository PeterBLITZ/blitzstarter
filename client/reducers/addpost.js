import { ADD_IMAGES, ADD_POST_FOCUSED } from '../constants/AddPost';

const initialState = {
  addPostFocused: false,
};

const addpost = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_FOCUSED:
      return { ...state, addPostFocused: action.payload };
    case ADD_IMAGES:
      return { ...state, images: action.payload };
    default:
      return state;
  }
};

export default addpost;
