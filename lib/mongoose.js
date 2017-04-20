var mongoose      = require('mongoose')
    mongoose.set('debug', true)
var config        = require('config')

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'))

module.exports = mongoose
