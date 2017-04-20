// const log = require('lib/log')(module)
const config = require('config');
const mongoose = require('mongoose');

// mongoose.set('debug', function (collectionName, methodName, query, doc) {
//   log.log('debug', 'mongo', ...arguments)
// })

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;
