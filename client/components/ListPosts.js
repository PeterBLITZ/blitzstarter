import React,  { Component } from 'react'
import Post from './Post'

class ListPosts extends Component {
  render() {
    const { posts, addLike, addDislike, isGoodNews, myId } = this.props

    const filtered = isGoodNews
      ? Array.prototype.filter.call(posts, post => {
          const likes    = post.likes    && post.likes.length    ? post.likes.length    : 0
          const dislikes = post.dislikes && post.dislikes.length ? post.dislikes.length : 0
          return likes >= ((likes+dislikes)*0.8)
        })
      : posts

    return (
      <div>
        {Array.prototype.map.call(filtered, (post, i) =>
          <Post
            key={i + post._id}
            {...post}
            myId={myId}
            addLike={addLike}
            addDislike={addDislike}
          />
        )}
      </div>
    )
  }
}

export default ListPosts
