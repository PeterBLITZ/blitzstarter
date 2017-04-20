import { ADD_POST, ADD_POST_SUCCESS } from '../types/AddPost';

import { ADD_LIKE, ADD_DISLIKE } from '../types/Post';

import {
  FETCH_ALL_POSTS,
  FETCH_ALL_POSTS_SUCCESS,
  FETCH_ALL_POSTS_FAIL,
} from '../types/FetchData';

const initialState = [];

const posts = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return [
        {
          name: action.payload.name,
          url: action.payload.url,
          descr: action.payload.descr || '',
          images: action.payload.images || '',
          _id: action.payload._id,
          likes: [],
          dislikes: [],
          temp: true,
        },
        ...state,
      ];

    case ADD_POST_SUCCESS:
      return [
        {
          name: action.payload.name,
          url: action.payload.url,
          descr: action.payload.descr || '',
          _id: action.payload._id,
          images: action.payload.images,
          likes: action.payload.likes || [],
          dislikes: action.payload.dislikes || [],
        },
        ...state.filter(post => post._id !== action.payload.tempId),
      ];

    case FETCH_ALL_POSTS:
      return state;
    case FETCH_ALL_POSTS_SUCCESS:
      return [...action.payload];
    case FETCH_ALL_POSTS_FAIL:
      return state;

    case ADD_LIKE:
      return [
        ...state.map(
          post =>
            post._id === action.payload._id
              ? { ...post, likes: [...post.likes, action.payload.userId] }
              : post
        ),
      ];

    case ADD_DISLIKE:
      return [
        ...state.map(
          post =>
            post._id === action.payload._id
              ? { ...post, dislikes: [...post.dislikes, action.payload.userId] }
              : post
        ),
      ];

    default:
      return state;
  }
};

export default posts;
