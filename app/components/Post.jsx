import React, { Component } from 'react';
import { Card, CardTitle, CardText, CardActions, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ActionThumbDown from 'material-ui/svg-icons/action/thumb-down';
import { grey500, pinkA200, cyan500 } from 'material-ui/styles/colors';
import Badge from 'material-ui/Badge';

import ImageSlider from './ImageSlider';

const styles = {
  card: {
    marginBottom: 20,
  },
  link: {
    display: 'inline-block',
    textDecoration: 'none',
    color: 'gray',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '30ch',
    verticalAlign: 'top',
  },
};

class Post extends Component {
  onLikeTap = () => {
    this.props.addLike(this.props._id, this.props.myId);
  };
  onDislikeTap = () => {
    this.props.addDislike(this.props._id, this.props.myId);
  };

  render() {
    const { name, url, descr, images, likes, dislikes, myId, temp } = this.props;

    const isLiked = likes ? likes.filter(like => like === myId).length > 0 : false;
    const isDisliked = dislikes ? dislikes.filter(like => like === myId).length > 0 : false;

    const isLikedOrDisliked = isLiked || isDisliked || temp;

    let showMedia = null;
    if (images && images.length) {
      showMedia = images.length <= 1
        ? <img src={`/uploads/${images[0]}`} alt='Post header' />
        : <ImageSlider images={images} />;
    }

    const urlIsHttp = url ? url.match(/^https?:\/\//) : false;
    const urlFix = urlIsHttp ? url : `http://${url}`;
    const showURL = url
      ? <a
          style={styles.link}
          href={`${urlFix}`}
          target='_blank'
          rel='noopener noreferrer'
          title={url}
        >
          {url}
        </a>
      : null;

    return (
      <Card style={styles.card}>

        <CardMedia>
          {showMedia}
        </CardMedia>

        <CardTitle style={styles.cardTitle} title={name} subtitle={showURL} />

        <CardText>
          <p>{descr}</p>
        </CardText>

        <Divider />
        <CardActions>
          <div>
            <Badge
              badgeContent={dislikes ? dislikes.length : 0}
              primary
              badgeStyle={{ top: 35, right: 2 }}
            >
              <IconButton
                tooltip='Dislike'
                disabled={isLikedOrDisliked}
                onTouchTap={this.onDislikeTap}
              >
                <ActionThumbDown color={isLikedOrDisliked ? grey500 : pinkA200} />
              </IconButton>
            </Badge>
            <Badge
              badgeContent={likes ? likes.length : 0}
              secondary
              badgeStyle={{ top: 35, right: 66 }}
            >
              <IconButton tooltip='Like' disabled={isLikedOrDisliked} onTouchTap={this.onLikeTap}>
                <ActionThumbUp color={isLikedOrDisliked ? grey500 : cyan500} />
              </IconButton>
            </Badge>
          </div>
        </CardActions>

      </Card>
    );
  }
}

export default Post;
