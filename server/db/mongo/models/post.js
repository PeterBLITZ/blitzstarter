import mongoose from 'mongoose';

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const schema = new Schema({
  userId: Schema.Types.ObjectId,
  name: String,
  url: String,
  likes: [Schema.Types.ObjectId],
  dislikes: [Schema.Types.ObjectId],
  descr: String,
  images: [String],
  created: {
    type: Date,
    default: Date.now,
  },
});

schema.statics.postNew = function(req, callback) {
  const Post = this;
  const postObj = {
    userId: req.user._id,
    name:   req.body.name,
    url:    req.body.url,
    descr:  req.body.descr,
    images: req.files.length ? req.files.map(i => i.filename) : [],
  };
  const post = new Post(postObj);
  return post.save();
};

schema.statics.postLike = function(req) {
  const Post = this;
  return Post.findOneAndUpdate(
    { _id: req.params.postId },
    { $push: { likes: req.user._id } }
  );
};

schema.statics.postDislike = function(req) {
  const Post = this;
  return Post.findOneAndUpdate(
    { _id: req.params.postId },
    { $push: { dislikes: req.user._id } }
  );
};

const Post = mongoose.model('Post', schema);

export default Post;
