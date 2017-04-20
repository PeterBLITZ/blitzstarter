import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';

import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import { cyan600, cyan500 } from 'material-ui/styles/colors';

import AddPost from '../components/AddPost';

import * as loginActions from '../actions/LoginActions';
import * as addPostActions from '../actions/AddPostActions';
import * as appActions from '../actions/AppActions';

const styles = {
  appBarWrap: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100%',
    zIndex: '1000',
    backgroundColor: cyan500,
  },
  top: {
    height: '40px',
    backgroundColor: cyan600,
  },
  addPostPaper: {
    margin: '0 auto',
    marginTop: '11px',
    width: '500px',
  },
  logout: {
    dispaly: 'inline-block',
    float: 'right',
  },
  toggle: {
    display: 'inline-block',
  },
};

class AppBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      toggled: false,
    };
  }

  onToggleHandle = () => {
    this.setState({ ...this.state, toggled: !this.state.toggled }, () => {
      console.log(this.state.toggled);
      this.props.appActions.isGoodNews(this.state.toggled);
    });
  };

  render() {
    const { images, login, onLogoutTouchTapEvent, addpost } = this.props;
    const { addPost, addImages, onAddPostFocused } = this.props.addPostActions;

    return (
      <div style={styles.appBarWrap}>
        <div style={styles.top}>
          <FlatButton
            style={styles.logout}
            label='Logout'
            onTouchTap={() => onLogoutTouchTapEvent()}
          />
          <div style={styles.toggle}>
            <Toggle
              label='Show only good news'
              labelPosition='right'
              onToggle={this.onToggleHandle}
              toggled={this.state.toggled}
            />
          </div>
        </div>
        <div style={styles.addPostPaper}>
          <AddPost
            addPost={addPost}
            addImages={addImages}
            selfId={login._id}
            images={images}
            onAddPostFocused={onAddPostFocused}
            focused={addpost.addPostFocused}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  addpost: state.addpost,
  images: state.addpost.images,
  login: state.login,
  app: state.app,
});

const mapDispatchToProps = dispatch => ({
  onGoToUTapEvent: _id => {
    dispatch(push(`/u/${_id}`));
  },
  onLogoutTouchTapEvent: () => {
    dispatch(loginActions.logout());
  },
  addPostActions: bindActionCreators(addPostActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);
