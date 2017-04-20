const crypto = require('crypto');

module.exports = {
  hex(len) {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
  },
};
