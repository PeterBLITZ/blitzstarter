import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoginBox from '../components/LoginBox';
import * as loginActions from '../actions/LoginActions';

const styles = {
  box: {
    margin: '10% auto',
    width: '500px',
    height: '100px',
  },
};

class LoginOrRegister extends Component {
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    if (nextProps.login.auth) {
      this.props.loginActions.loginReplace('/news');
    }
  }

  render() {
    const { loginFacebook, SoL } = this.props.loginActions;
    return (
      <div>
        <div style={styles.box}>
          <LoginBox loginFacebook={loginFacebook} SoL={SoL} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginOrRegister);
