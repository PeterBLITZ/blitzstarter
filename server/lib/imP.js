const fs    = require('fs')
const async = require('async')
const sharp = require('sharp')

let AWS = require('aws-sdk')
    AWS.config.region = 'eu-central-1'

const UPLOAD_FOLDER = 'uploads'
const S3_BUCKET = 'blitzstarter-bucket'

const versionsDefaults = [
  {
    width: 600,
    resizeStyle: 'aspectfit',
    quality: 10,
    format: 'JPEG',
    prefix: 'thumb1-',
    bucket: S3_BUCKET,
  }
]

const imWrite = ({buffer, key, bucket = S3_BUCKET}) => {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3()
    s3.putObject({
      Bucket: bucket,
      Key:    key,
      Body:   buffer,
      ACL:    'public-read'
    }, (err, res) => {
      if(err) {return reject(err)}
      return resolve(key)
    })
  })
}

const imConvert = (options, buffer, src) => {
  return new Promise((resolve, reject) => {
    sharp(buffer)
      .resize(options.width)
      .toBuffer((err, resizedBuffer, info) => {
        if (err) {return reject(err)}
        const key = options.prefix + info.width + 'x' + info.height + '-' + src
        return resolve({buffer: resizedBuffer, key, bucket: options.bucket})
      })
  })
}

const readFile = src => {
  return new Promise((resolve, reject) => {
    fs.readFile(src, (err, buffer) => {
      if (err) {return reject(err)}
      return resolve(buffer)
    })
  })
}

const saveOneP = ( src, versions = versionsDefaults ) =>
  readFile(UPLOAD_FOLDER + '/' + src)
    .then(buffer =>
      Promise.all(versions.map(options =>
        imWrite({buffer, key: options.prefix + src, bucket: options.bucket})
      ))
    )

const convertOneAndSaveP = ( src, versions = versionsDefaults ) =>
  readFile(UPLOAD_FOLDER + '/' + src)
    .then(buffer =>
      Promise.all(versions.map(options =>
        imConvert(options, buffer, src)
          .then(resizedBufKeyBuck => imWrite(resizedBufKeyBuck))
      )))

module.exports.saveOneP = saveOneP
module.exports.convertOneAndSaveP = convertOneAndSaveP
