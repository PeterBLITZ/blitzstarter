import fs from 'fs';
import path from 'path';
import multer from 'multer';
import url from 'url';
import request from 'request';
import async from 'async';
import validator from 'validator';

import logger from '../../../lib/logger';
import rand from '../../../lib/rand';
import wrap from '../../../middleware/asyncErrorHandling';
import parser from '../../../parser';

import Post from '../models/post';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + rand.hex(20) + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const log = logger(__filename);

export const add = [
  upload.array('postImages'),
  wrap(async (req, res) => {
    async.waterfall(
      [
        async (callback) => {
          try {
            const result = await parser(req.body.name);
            if (result.title) req.body.name = result.title;
            if (result.url)   req.body.url  = result.url;
            if (result.file)  req.body.url  = result.input;
            if (result.file)  req.body.name = '';
            if (result.description) req.body.descr = result.description;
            return callback(null, result);
          } catch (err) {
            return log.error('parser err', err);
          }
        },
        (result, callback) => {
          // image parser
          if (result && result.images) {
            const urlObject = url.parse(result.images);
            let uri = url.format(urlObject);
            uri = validator.isAscii(uri) ? uri : encodeURI(uri);

            const imgName = `${Date.now() + rand.hex(20)}.jpg`;
            const opts = {
              timeout: 10500,
              headers: {
                'User-Agent': 'request',
              },
              uri,
            };

            return request(opts)
              .on('error', err => {
                log.error(err);
                return callback(err);
              })
              .pipe(fs.createWriteStream(`public/uploads/${imgName}`))
              .on('close', () => {
                req.files.push({ filename: imgName });
                return callback(null);
              });
          }
          return callback(null);
        },
      ],
      async (err) => {
        if (err) { log.error(err); }
        try {
          const postObj = await Post.postNew(req);
          res.json({
            user: req.user,
            post: {
              _id: postObj._id,
              name: postObj.name,
              url: postObj.url,
              descr: postObj.descr,
              images: postObj.images,
            },
          });
        } catch (error) {
          log.error(error);
          res.sendStatus(404);
        }
      }
    )
})];

export const all = wrap(async (req, res) => {
  try {
    const allposts = await Post.find({}, null, { sort: { created: -1 } });
    res.json({
      user: req.user,
      allposts,
    });
  } catch (err) {
    log.error(err);
    res.sendStatus(404);
  }
});

export const like = wrap(async (req, res) => {
  try {
    await Post.postLike(req);
    res.sendStatus(200);
  } catch (err) {
    log.error(err);
    res.sendStatus(404);
  }
});

export const dislike = wrap(async (req, res) => {
  try {
    await Post.postDislike(req);
    res.sendStatus(200);
  } catch (err) {
    log.error(err);
    res.sendStatus(404);
  }
});

export default {
  add,
  all,
  like,
  dislike,
};
