import winston from 'winston';
// winston.emitErrs = true; // http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
const ENV = process.env.NODE_ENV;

function getLogger(label) {
  // var path = module.filename.split('/').slice(-2).join('/');
  const logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: ENV === 'development' ? 'debug' : 'error',
        label,
      }),
    ], //,exitOnError: false // http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
  })

  logger.stream = {
    write: (message) => { // (message, encoding);
        logger.info(message);
    },
  };

  return logger;
}

export default getLogger;
