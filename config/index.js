var fs    = require('fs');
var nconf = require('nconf');
var path  = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

nconf.argv().env();

var env = nconf.get('NODE_ENV');
nconf.file(env, path.join(__dirname, 'config.' + env + '.json'));

module.exports = nconf;
