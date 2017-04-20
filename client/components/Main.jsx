import React, { Component } from 'react';
import AppBar from './AppBar';
import AllPosts from '../containers/AllPosts';

import { fetchAllPosts } from '../actions/FetchDataActions';

class Main extends Component {
  static need = [
    // eslint-disable-line
    fetchAllPosts,
  ];

  render() {
    return (
      <div>
        <AppBar />
        <AllPosts />
      </div>
    );
  }
}

export default Main;
