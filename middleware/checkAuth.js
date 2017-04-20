var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(new HttpError(401, 'U dnt Authorized'));
  }
  next();
};
