import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as fetchDataActions from '../actions/FetchDataActions';
import * as postActions from '../actions/PostActions';

import ListPosts from '../components/ListPosts';

const styles = {
  allPostsWrap: {
    position: 'relative',
    margin: 'auto',
    width: '500px',
    top: '120px'
  }
}

class AllPosts extends Component {

  componentDidMount() {
    setInterval(() => this.props.fetchDataActions.fetchAllPosts(), 30000);
  }

  render() {
    const { posts, app, login } = this.props;
    const { addLike, addDislike } = this.props.postActions;
    return (
      <div style={styles.allPostsWrap} >
        <ListPosts
          posts={posts}
          addLike={addLike}
          addDislike={addDislike}
          isGoodNews={app.isGoodNews}
          myId={login._id}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts,
    login: state.user,
    app: state.app
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDataActions: bindActionCreators(fetchDataActions, dispatch),
    postActions: bindActionCreators(postActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts)
