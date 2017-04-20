var crypto = require('crypto')

module.exports = {
  hex: function(len) {
    return crypto.randomBytes(Math.ceil(len/2))
      .toString('hex')
      .slice(0,len)
  }
}
