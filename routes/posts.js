const Post = require('models/post').Post
const log = require('lib/log')(module)
const path = require('path')
const rand = require('lib/rand')

const url = require('url')
const request = require('request')
const fs = require('fs')
const async = require('async')
const validator = require('validator')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + rand.hex(20) + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

const parser = require('parser')

module.exports = function(app) {

  var methodOverride = require('method-override');
  app.all('/post/:id',
      upload.any('postImages'),
      methodOverride(function(req, res){
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
          var method = req.body._method
          delete req.body._method
          return method
        }
      }),
      function (req, res, next) { next('route'); }
  )

  app.post('/post', upload.array('postImages'), function(req, res, next) {

    async.waterfall([
      function(callback){
        // parser
        parser(req.body.name, function(err, result) {
          if (err) {
            log.error('parser err', err)
          } else {
              if (result.title)       req.body.name  = result.title
              if (result.url)         req.body.url   = result.url
              if (result.file)        req.body.url   = result.input
              if (result.file)        req.body.name  = ''
              if (result.description) req.body.descr = result.description
            return callback(null, result)
          }
        })
      },
      function(result, callback){
        // image parser
        if (result && result.images) {

          var urlObject = url.parse(result.images);
          var uri = url.format(urlObject);
          uri = validator.isAscii(uri) ? uri : encodeURI(uri)

          var imgName = Date.now() + rand.hex(20) + '.jpg';
          var opts = { timeout: 10500,
                       headers: {
                         'User-Agent': 'request',
                       },
                       uri: uri,
                     }

          request(opts)
          .on('error', function(err){
            log.error(err);
            return callback(err);
          })
          .pipe(fs.createWriteStream('public/uploads/' + imgName))
          .on('close', function(){
            req.files.push({filename: imgName});
            return callback(null);
          })
        } else {
          return callback(null);
        }
      }
    ], function (err, results){
      if (err) {log.error(err)}
      Post.postNew(req, function(err, postObj) {
        if (err) {return next(err) }
        res.json({
         user: req.user,
         post: {
           _id:    postObj._id,
           name:   postObj.name,
           url:    postObj.url,
           descr:  postObj.descr,
           images: postObj.images
         }
        })
      })
    })
  })

  app.get('/post', function(req, res, next) {
    Post.find({}, null, { sort:{ created: -1 } }, function(err, allposts) {
      if (err) return next(err)
      res.json({
        user: req.user,
        allposts: allposts
       })
    })
  })

  app.post('/post/:postId/like', function(req, res, next){
    Post.postLike(req, function(err, model) {
      if (err) return res.sendStatus(404)
      res.sendStatus(200);
    })
  })

  app.post('/post/:postId/dislike', function(req, res, next){
    Post.postDislike(req, function(err, model) {
      if (err) return res.sendStatus(404)
      res.sendStatus(200);
    })
  })

}
