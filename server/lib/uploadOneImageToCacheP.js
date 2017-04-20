const url       = require('url')
const fs        = require('fs')
const request   = require('request')
const validator = require('validator')
import rand from '../lib/rand';

const UPLOAD_FOLDER = 'uploads'

const upload = (imagesUrl) => {

  return new Promise(function(resolve, reject) {
    const urlObject   = url.parse(imagesUrl)
    const preValidUri = url.format(urlObject)
    const uri = validator.isAscii(preValidUri) ? preValidUri : encodeURI(preValidUri)
    const newNameImg = Date.now() + rand.hex(20) + '.jpg'
    const opts = {
                   timeout: 10500,
                   headers: {
                     'User-Agent': 'request'
                   },
                   uri: uri,
                 }
    request(opts)
      .on('error', err => reject(err))
      .pipe(fs.createWriteStream(UPLOAD_FOLDER + '/' + newNameImg))
      .on('close', () => resolve(newNameImg))

  })

}

module.exports = upload
