import React, { Component } from 'react';
import { loginInitialize } from '../actions/LoginActions';

class App extends Component {
  static need = [
    // eslint-disable-line
    loginInitialize,
  ];

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default App;
