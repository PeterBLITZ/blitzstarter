var mongoose = require('lib/mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
  userId: Schema.Types.ObjectId,
  name: String,
  url: String,
  likes: [Schema.Types.ObjectId],
  dislikes: [Schema.Types.ObjectId],
  descr: String,
  images: [String],
  created: {
    type: Date,
    default: Date.now
  }
})

schema.statics.postNew = function (req, callback) {
  var Post = this;
  var postObj = {
    'userId': req.user._id,
    'name':   req.body.name,
    'url':    req.body.url,
    'descr':  req.body.descr,
    'images': req.files.length ? req.files.map(i => i.filename) : []
  };
  var post = new Post(postObj);
  post.save(function(err, res) {
    if (err) return callback(err)
    callback(null, res);
  })
}

schema.statics.postLike = function (req, callback) {
  var Post = this;
  Post.findOneAndUpdate({_id: req.params.postId}, {$push: {likes: req.user._id}}, function(err, post) {
    if (err) return callback(err)
    callback(null, post)
  })
}

schema.statics.postDislike = function (req, callback) {
  var Post = this;
  Post.findOneAndUpdate({_id: req.params.postId}, {$push: {dislikes: req.user._id}}, function(err, post) {
    if (err) return callback(err)
    callback(null, post)
  })
}

exports.Post = mongoose.model('Post', schema)
