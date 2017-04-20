var winston = require('winston');
// winston.emitErrs = true; // http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
var ENV = process.env.NODE_ENV;

function getLogger(module) {
  var path = module.filename.split('/').slice(-2).join('/');
  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: ENV == 'development' ? 'debug' : 'error',
        label: path,
      }),
    ], //,exitOnError: false // http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
  });
}

module.exports = getLogger;
/* module.exports.stream = {   // http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
    write: function(message, encoding){
        this.info(message);
    }
};*/
