var log = require('lib/log')(module);

module.exports = function(req, res, next) {
  res.sendHttpError = function(error) {
    res.status(error.status);
    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
      // AJAX request
      res.json(error);
    } else {
      log.info('render sendHttpError');
      res.render('error', { error });
    }
  };
  log.info('export sendHttpError after res.sendHttpError and before next');
  next();
};
