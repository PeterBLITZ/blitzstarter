import axios from 'axios';

import logger from '../lib/logger';

import { ADD_POST, ADD_IMAGES, ADD_POST_SUCCESS, ADD_POST_FOCUSED } from '../types/AddPost';

const API_PATH = '/api/v0';

let idPost = 0;

export function addPost(name = '', postImages = [], descr = '', url = '') {
  return dispatch => {
    const dateTime = new Date().getTime();
    idPost += 1;
    const idGen = Math.floor(Math.random() * 1000 + 1) + dateTime + idPost;
    dispatch({
      type: ADD_POST,
      payload: {
        name,
        descr,
        url,
        _id: idGen,
      },
    });

    const data = new FormData();
    data.append('name', name);
    data.append('descr', descr);
    data.append('url', url);

    if (postImages.length) {
      Array.prototype.map.call(postImages, image => data.append('postImages', image));
    }

    axios
      .post(`${API_PATH}/post`, data)
      .then(res => {
        logger.log('ADD_POST_SUCCESS', res);
        dispatch({
          type: ADD_POST_SUCCESS,
          payload: {
            tempId: idGen,
            _id: res.data.post._id,
            name: res.data.post.name,
            url: res.data.post.url,
            descr: res.data.post.descr,
            images: res.data.post.images,
            likes: res.data.post.likes,
            dislikes: res.data.post.dislikes,
          },
        });
      })
      .catch(err => {
        logger.log('ADD_POST_FAIL', err);
      });
  };
}

export function addImages(images = []) {
  return {
    type: ADD_IMAGES,
    payload: images,
  };
}

export function onAddPostFocused(isFocused) {
  return {
    type: ADD_POST_FOCUSED,
    payload: isFocused,
  };
}
